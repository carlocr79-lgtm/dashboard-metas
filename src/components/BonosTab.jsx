import { useState } from 'react';
import { BarChart3, ClipboardList, CalendarCheck, XCircle, CheckCircle, ShieldAlert } from 'lucide-react';

// ═══ HELPERS ═══
function formatBadge(val) {
  const t = (val || '').toString().toLowerCase();
  let cls = 'badge-soft-neutral';
  if (t.includes('saludable') || t.includes('excelente') || t.includes('bien') || t.includes('cumple')) cls = 'badge-soft-success';
  else if (t.includes('crítico') || t.includes('mal') || t.includes('no cumple')) cls = 'badge-soft-danger';
  else if (t.includes('riesgo')) cls = 'badge-soft-warning';
  const num = parseFloat(t.replace('%', '').replace(',', '.'));
  if (!isNaN(num)) {
    if (num >= 100) cls = 'badge-soft-success';
    else if (num >= 80) cls = 'badge-soft-warning';
    else cls = 'badge-soft-danger';
  }
  return <span className={`badge-premium ${cls}`}>{val}</span>;
}

// ═══ FILA DE TABLA ═══
function BonoRow({ label, avance, estado, bono }) {
  const avanceDisplay = avance || '-';
  const bonoDisplay = bono || '';
  const bonoColor = bonoDisplay && bonoDisplay !== 'S/.0.00' ? '#002d72' : '#94a3b8';
  const estadoHtml = estado ? formatBadge(estado) : (avance ? formatBadge(avance) : <span style={{ color: 'var(--text-muted)' }}>-</span>);

  return (
    <tr>
      <td>{label}</td>
      <td className="metric-val" style={{ textAlign: 'center' }}>{avanceDisplay}</td>
      <td style={{ textAlign: 'center' }}>{estadoHtml}</td>
      <td style={{ textAlign: 'center', fontWeight: 800, color: bonoColor }}>{bonoDisplay}</td>
    </tr>
  );
}

// ═══ FILA TOTAL ═══
function TotalRow({ label, monto, bgColor, textColor }) {
  return (
    <tr style={{ background: bgColor }}>
      <td colSpan={3} style={{ fontWeight: 900, color: textColor, textAlign: 'right', borderRadius: '12px 0 0 12px' }}>{label}</td>
      <td style={{ textAlign: 'center', fontWeight: 900, fontSize: '1.05rem', color: textColor, borderRadius: '0 12px 12px 0' }}>{monto}</td>
    </tr>
  );
}

// ═══ SUB-VISTA: PRODUCTIVIDAD MENSUAL ═══
function ProductividadView({ bonos }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="glass-card">
        <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={16} /> PRODUCTIVIDAD - MENSUAL
        </h5>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-premium">
            <thead>
              <tr>
                <th>Indicador</th>
                <th style={{ textAlign: 'center' }}>Avance</th>
                <th style={{ textAlign: 'center' }}>Estado</th>
                <th style={{ textAlign: 'center' }}>Bono S/.</th>
              </tr>
            </thead>
            <tbody>
              <BonoRow label="Saldo Mínimo" avance={bonos.saldoMinimoAvance} estado={bonos.estadoSaldoMinimo} bono="" />
              <BonoRow label="Saldo Mensual" avance={bonos.saldoMensualAvance} estado={bonos.estadoSaldoMensual} bono={bonos.bonoSaldoMensual} />
              <BonoRow label="Colocación Mensual" avance={bonos.colocacionMensualAvance} estado={bonos.estadoColocacionMensual} bono={bonos.bonoColocacionMensual} />
              <TotalRow label="TOTAL PRODUCTIVIDAD" monto={bonos.totalProductividadMensual} bgColor="#eff6ff" textColor="#1e40af" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══ SUB-VISTA: INDICADORES MENSUAL ═══
function IndicadoresView({ bonos }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="glass-card">
        <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClipboardList size={16} /> INDICADORES - MENSUAL
        </h5>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-premium">
            <thead>
              <tr>
                <th>Indicador</th>
                <th style={{ textAlign: 'center' }}>Avance</th>
                <th style={{ textAlign: 'center' }}>Estado</th>
                <th style={{ textAlign: 'center' }}>Bono S/.</th>
              </tr>
            </thead>
            <tbody>
              <BonoRow label="Tasa Promedio" avance={bonos.tasaPromedioAvance} estado={bonos.estadoTasaPromedio} bono="" />
              <BonoRow label="N° Operaciones" avance={bonos.nOperacionesAvance} estado={bonos.estadoOperaciones} bono="" />
              <BonoRow label="Clientes Nuevos" avance={bonos.clientesNuevosAvance} estado={bonos.estadoNuevos} bono="" />
              <BonoRow label="Clientes Activos" avance={bonos.clientesActivosAvance} estado={bonos.estadoActivos} bono="" />
              <TotalRow label="TOTAL INDICADORES" monto={bonos.totalIndicadoresMensual} bgColor="#fefce8" textColor="#854d0e" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══ SUB-VISTA: PRODUCTIVIDAD TRIMESTRAL ═══
function TrimestralView({ bonos }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="glass-card">
        <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarCheck size={16} /> PRODUCTIVIDAD - TRIMESTRAL
        </h5>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-premium">
            <thead>
              <tr>
                <th>Indicador</th>
                <th style={{ textAlign: 'center' }}>Avance</th>
                <th style={{ textAlign: 'center' }}>Estado</th>
                <th style={{ textAlign: 'center' }}>Bono S/.</th>
              </tr>
            </thead>
            <tbody>
              <BonoRow label="Saldo Trimestral" avance={bonos.saldoTrimestralAvance} estado={bonos.estadoSaldoTrim} bono="" />
              <BonoRow label="Colocación Trimestral" avance={bonos.colocacionTrimestralAvance} estado={bonos.estadoColocTrim} bono="" />
              <TotalRow label="TOTAL TRIMESTRAL" monto={bonos.bonoTrimestralTotal} bgColor="#eff6ff" textColor="#1e40af" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══ COMPONENTE PRINCIPAL: BONOS TAB ═══
export default function BonosTab({ data }) {
  const [subView, setSubView] = useState('productividad');

  const bonos = data?.bonos;

  // Sin datos de bonos
  if (!bonos) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <ShieldAlert size={48} color="#cbd5e1" />
        <h5 style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Sin Datos de Bonos</h5>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No se encontraron datos de comisiones para tu usuario.</p>
      </div>
    );
  }

  // Detectar si comisiona
  const comisiona = bonos.estadoMora.toLowerCase().includes('comisiona') && !bonos.estadoMora.toLowerCase().includes('no comisiona');

  // ═══ SI NO COMISIONA ═══
  if (!comisiona) {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div className="glass-card" style={{ border: '1px solid #fca5a5' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #fee2e2, #fecaca)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <XCircle size={32} color="#da291c" />
            </div>
            <h5 style={{ fontWeight: 900, color: '#da291c', marginBottom: '6px', fontSize: '1.1rem' }}>No Comisiona Este Periodo</h5>
            <div style={{ background: '#fef2f2', padding: '8px 20px', borderRadius: '20px', marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #fecaca' }}>
              <ShieldAlert size={14} color="#da291c" />
              <span style={{ fontWeight: 800, color: '#da291c', fontSize: '0.85rem' }}>Mora: {bonos.moraReal} — {bonos.estadoMora}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>
              La mora actual excede el límite permitido para comisionar.<br />
              <span style={{ fontSize: '0.72rem' }}>Trabaja en reducir tu mora para habilitar los bonos disponibles. 💪</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══ SI COMISIONA ═══
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Resumen de Bonos */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <h5 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>RESUMEN DE BONOS</h5>
          <span style={{ background: '#eff6ff', color: '#1e40af', padding: '5px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #bfdbfe' }}>
            <CheckCircle size={12} /> Mora: {bonos.moraReal} — {bonos.estadoMora}
          </span>
        </div>
        <div className="bonos-grid-cards">
          <div className="bonos-card-item bonos-card-mensual">
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Bono Mensual</div>
            <div className="bonos-monto">{bonos.bonoMensualTotal}</div>
            <div className="bonos-fecha">Corte: {bonos.fechaCorteMes} • Pago: {bonos.fechaPagoMes}</div>
          </div>
          <div className="bonos-card-item bonos-card-trimestral">
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Bono Trimestral</div>
            <div className="bonos-monto" style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{bonos.bonoTrimestralTotal}</div>
            <div className="bonos-fecha">Corte: {bonos.fechaCorteTrim} • Pago: {bonos.fechaPagoTrim}</div>
          </div>
        </div>
      </div>

      {/* Sub-navegación */}
      <div className="glass-card" style={{ padding: '8px 12px' }}>
        <div className="sub-nav-wrapper">
          <button className={`sub-nav-btn${subView === 'productividad' ? ' active' : ''}`} onClick={() => setSubView('productividad')}>
            <BarChart3 size={14} /> Productividad
          </button>
          <button className={`sub-nav-btn${subView === 'indicadores' ? ' active' : ''}`} onClick={() => setSubView('indicadores')}>
            <ClipboardList size={14} /> Indicadores
          </button>
          <button className={`sub-nav-btn${subView === 'trimestral' ? ' active' : ''}`} onClick={() => setSubView('trimestral')}>
            <CalendarCheck size={14} /> Trimestral
          </button>
        </div>
      </div>

      {subView === 'productividad' && <ProductividadView bonos={bonos} />}
      {subView === 'indicadores' && <IndicadoresView bonos={bonos} />}
      {subView === 'trimestral' && <TrimestralView bonos={bonos} />}
    </div>
  );
}
