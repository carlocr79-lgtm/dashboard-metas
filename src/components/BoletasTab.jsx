import { FolderOpen, Calendar, Eye, Download, FileText } from 'lucide-react';
import { useState } from 'react';

export default function BoletasTab({ data }) {
  const [anioActivo, setAnioActivo] = useState(null);

  // Garantizar que boletas sea un array, nunca un objeto o undefined
  const rawBoletas = data?.boletas;
  const boletas = Array.isArray(rawBoletas) ? rawBoletas : [];

  if (!boletas || boletas.length === 0) {
    return (
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <FolderOpen size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
        <h5 style={{ fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Sin Boletas de Pago</h5>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aún no se han registrado boletas de pago para tu usuario.</p>
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
  
  // Usar el primer año disponible si no hay selección
  const anioReal = (anioActivo && porAnio[anioActivo]) ? anioActivo : anios[0];
  const itemsMostrar = porAnio[anioReal] || [];

  const mesesIconos = { 
    'ENERO': '❄️', 'FEBRERO': '💝', 'MARZO': '🌼', 'ABRIL': '🌧️', 'MAYO': '🌹', 
    'JUNIO': '☀️', 'JULIO': '🇵🇪', 'AGOSTO': '🍃', 'SEPTIEMBRE': '🍂', 'OCTUBRE': '🎃', 
    'NOVIEMBRE': '🧑‍🌾', 'DICIEMBRE': '🎄' 
  };

  const manejarDescarga = (boleta) => {
    // Aquí implementaremos la lógica del fetch para descargar el blob desde codigo.gs
    alert(`Iniciando descarga de ${boleta.descripcion}...`);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      <div className="glass-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-bank)', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              style={{
                flex: 1,
                minWidth: '80px',
                background: a === anioReal ? 'var(--primary-bank)' : 'transparent',
                color: a === anioReal ? 'white' : '#64748b',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.3s ease'
              }}
            >
              <Calendar size={14} /> {a}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {itemsMostrar.map((b, i) => {
            const icono = mesesIconos[b.mes] || '📄';
            const mesCorto = b.mes.charAt(0) + b.mes.slice(1).toLowerCase();

            return (
              <div key={i} className="boleta-item" style={{ 
                background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px 16px', 
                display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-premium), var(--shadow-inner)',
                transition: 'all 0.3s ease'
              }}>
                <span style={{ fontSize: '1.4rem' }}>{icono}</span>
                <div style={{ flex: 1, fontWeight: 800, color: 'var(--primary-bank)', fontSize: '0.95rem' }}>
                  {mesCorto} {b.anio}
                </div>
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={() => manejarDescarga(b)} 
                    style={{ background: 'var(--grad-violet)', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Previsualizar"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => manejarDescarga(b)} 
                    style={{ background: 'var(--grad-sapphire)', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Descargar"
                  >
                    <Download size={16} />
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
