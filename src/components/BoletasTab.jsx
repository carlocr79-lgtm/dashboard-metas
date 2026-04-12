import { FolderOpen, Calendar, Eye, Download, FileText, Loader2, FileSignature } from 'lucide-react';
import { useState } from 'react';
import { callGAS } from '../services/api';

// ═══ HELPERS ═══
function base64ToBlob(base64, tipo) {
  const byteChars = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteChars.length; offset += 512) {
    const slice = byteChars.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays, { type: tipo });
}

export default function BoletasTab({ data }) {
  const [anioActivo, setAnioActivo] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // Garantizar que boletas sea un array
  const rawBoletas = data?.boletas;
  const boletas = Array.isArray(rawBoletas) ? rawBoletas : [];

  if (!boletas || boletas.length === 0) {
    return (
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <FolderOpen size={48} color="#cbd5e1" style={{ marginBottom: '16px', opacity: 0.3 }} />
        <h5 style={{ fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Sin Boletas de Pago</h5>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aún no se han registrado boletas de pago para tu usuario.<br />Cuando se carguen, aparecerán aquí.</p>
      </div>
    );
  }

  // Agrupar por año
  const porAnio = {};
  boletas.forEach(b => {
    if (!porAnio[b.anio]) porAnio[b.anio] = [];
    porAnio[b.anio].push(b);
  });
  
  const anios = Object.keys(porAnio).sort((a, b) => Number(b) - Number(a));
  const anioReal = (anioActivo && porAnio[anioActivo]) ? anioActivo : anios[0];
  const itemsMostrar = porAnio[anioReal] || [];

  // Meses orden para extraer número si lo necesitamos (opcional)
  const mesesOrden = { 
    'ENERO': '01', 'FEBRERO': '02', 'MARZO': '03', 'ABRIL': '04', 'MAYO': '05', 
    'JUNIO': '06', 'JULIO': '07', 'AGOSTO': '08', 'SEPTIEMBRE': '09', 'OCTUBRE': '10', 
    'NOVIEMBRE': '11', 'DICIEMBRE': '12' 
  };

  // ═══ DESCARGA REAL ═══
  const descargarBoleta = async (fileId, descripcion) => {
    setLoadingId('download-' + fileId);
    try {
      const result = await callGAS('descargarBoleta', [fileId]);
      if (result.error) {
        alert('Error: ' + result.error);
        return;
      }
      const blob = base64ToBlob(result.data, result.tipo);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      alert('Error al descargar la boleta');
    }
    setLoadingId(null);
  };

  // ═══ PREVIEW REAL ═══
  const verBoleta = async (fileId) => {
    setLoadingId('view-' + fileId);
    try {
      const result = await callGAS('descargarBoleta', [fileId]);
      if (result.error) {
        alert('Error: ' + result.error);
        return;
      }
      const blob = base64ToBlob(result.data, result.tipo);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      alert('Error al cargar la boleta');
    }
    setLoadingId(null);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      <div className="glass-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-bank)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
            <FileText size={18} color="var(--primary-bank)" /> MIS BOLETAS
          </h5>
          <span style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #bfdbfe' }}>
            {boletas.length} total
          </span>
        </div>

        {/* Filtro de Años */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '12px', marginBottom: '16px', overflowX: 'auto' }}>
          {anios.map(a => (
            <button 
              key={a}
              onClick={() => setAnioActivo(a)}
              className={`sub-nav-btn${a === anioReal ? ' active' : ''}`}
              style={{ flex: 1, minWidth: '80px', padding: '6px 18px', fontSize: '0.75rem' }}
            >
              <Calendar size={12} /> {a}
            </button>
          ))}
        </div>

        {/* Grid de Boletas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {itemsMostrar.map((b, i) => {
            const numMes = mesesOrden[b.mes] || '📄';
            const mesCorto = b.mes.charAt(0) + b.mes.slice(1).toLowerCase();
            const isLoadingDownload = loadingId === 'download-' + b.fileId;
            const isLoadingView = loadingId === 'view-' + b.fileId;

            return (
              <div key={i} style={{ 
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '10px 12px', 
                display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-premium), var(--shadow-inner)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af'
                }}>
                  <FileSignature size={16} />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary-bank)' }}>{mesCorto}</div>
                   <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700 }}>Boleta {numMes}/{b.anio}</div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => verBoleta(b.fileId)} 
                    disabled={isLoadingView}
                    style={{ padding: '6px 10px', background: 'var(--grad-violet)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', opacity: isLoadingView ? 0.7 : 1, display: 'flex', alignItems: 'center' }}
                    title="Ver"
                  >
                    {isLoadingView ? <Loader2 size={14} className="spin-anim" /> : <Eye size={14} />}
                  </button>
                  <button 
                    onClick={() => descargarBoleta(b.fileId, b.descripcion)} 
                    disabled={isLoadingDownload}
                    style={{ padding: '6px 10px', background: 'var(--grad-sapphire)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', opacity: isLoadingDownload ? 0.7 : 1, display: 'flex', alignItems: 'center' }}
                    title="Descargar"
                  >
                    {isLoadingDownload ? <Loader2 size={14} className="spin-anim" /> : <Download size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
