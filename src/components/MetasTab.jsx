import { useState, useEffect, useRef } from 'react';
import { Calendar, TrendingUp, Users, ShieldAlert, Coins, ChevronDown, ChevronUp, Building2, Loader2, DollarSign, X, CheckCircle, XCircle, BarChart3, ClipboardList, CalendarCheck } from 'lucide-react';
import { callGAS } from '../services/api';

// ═══ HELPERS ═══
function getStatusColor(val) {
  const t = (val || '0').toString().toLowerCase();
  if (t.includes('saludable') || t.includes('excelente') || t.includes('bien')) return '#002d72';
  if (t.includes('crítico') || t.includes('mal')) return '#da291c';
  if (t.includes('riesgo')) return '#3b82f6';
  const num = parseFloat(t.replace('%', '').replace(',', '.'));
  if (!isNaN(num)) {
    if (num >= 100) return '#002d72'; // Azul Corporativo Fuerte (Superó Meta)
    if (num >= 80) return '#3b82f6';  // Azul Claro (Progreso Seguro)
    return '#da291c';                 // Rojo Corporativo (Riesgo)
  }
  return 'var(--primary-bank)';
}

function getMoraColor(val) {
  const t = (val || '0').toString().toLowerCase();
  if (t.includes('saludable') || t.includes('excelente') || t.includes('bien')) return '#002d72';
  if (t.includes('crítico') || t.includes('mal')) return '#da291c';
  if (t.includes('riesgo')) return '#3b82f6';
  const num = parseFloat(t.replace('%', '').replace(',', '.'));
  if (!isNaN(num)) {
    if (num <= 3) return '#002d72'; // Azul Fuerte (Mora Excelente)
    if (num <= 5) return '#3b82f6'; // Azul Claro (Mora Aceptable)
    return '#da291c';               // Rojo (Mora Peligro)
  }
  return 'var(--primary-bank)';
}

function formatBadge(val) {
  const t = (val || '').toString().toLowerCase();
  let cls = 'badge-soft-neutral';
  if (t.includes('saludable') || t.includes('excelente') || t.includes('bien')) cls = 'badge-soft-success';
  else if (t.includes('crítico') || t.includes('mal')) cls = 'badge-soft-danger';
  else if (t.includes('riesgo')) cls = 'badge-soft-warning';
  const num = parseFloat(t.replace('%', '').replace(',', '.'));
  if (!isNaN(num)) {
    if (num >= 100) cls = 'badge-soft-success';
    else if (num >= 80) cls = 'badge-soft-warning';
    else cls = 'badge-soft-danger';
  }
  return <span className={`badge-premium ${cls}`}>{val}</span>;
}

function shortName(fullName) {
  const parts = (fullName || '').trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  if (parts.length === 3) return parts[0] + ' ' + parts[2];
  if (parts.length >= 4) return parts[0] + ' ' + parts[2] + ' ' + parts[3].charAt(0) + '.';
  return fullName;
}

// ═══ SVG GAUGE COMPONENT ═══
function GaugeRing({ value, color }) {
  const r = 14;
  const circum = 2 * Math.PI * r;
  const pctNum = parseFloat((value || '0').toString().replace('%', '').replace(',', '.')) || 0;
  const pctClamped = Math.min(Math.max(pctNum, 0), 100);
  const pctDisplay = Math.round(pctNum);

  // Estado para la animación de inicio a fin
  const [offset, setOffset] = useState(circum);

  useEffect(() => {
    const finalOffset = circum - (pctClamped / 100) * circum;
    // Un pequeño retraso permite que React pinte el frame inicial en 0 antes de transicionar
    const timer = setTimeout(() => setOffset(finalOffset), 50);
    return () => clearTimeout(timer);
  }, [pctClamped, circum]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '38px', height: '38px', filter: `drop-shadow(0 2px 4px ${color}30)` }}>
        <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
          <circle cx="18" cy="18" r={r} fill="none" stroke="#f1f5f9" strokeWidth="3" />
          <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={circum} strokeDashoffset={offset} strokeLinecap="round" 
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }} />
        </svg>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.65rem', fontWeight: 900, color: color, letterSpacing: '-0.5px'
        }}>
          {pctDisplay}%
        </div>
      </div>
    </div>
  );
}

// ═══ INDICADOR BADGE EXPANDIBLE ═══
function IndicatorBadge({ icon: Icon, label, situation, sitColor, meta, real, realColor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="ind-badge" ref={ref} onClick={() => setOpen(!open)}
      style={{ borderColor: sitColor + '40', background: sitColor + '08', zIndex: open ? 100 : 1 }}>
      <div className="ind-badge-inner">
        <Icon size={12} color="#64748b" />
        <span className="ind-badge-label">{label}</span>
        <span className="ind-badge-value" style={{ color: sitColor }}>{situation || '--'}</span>
        {open ? <ChevronUp size={10} color="#94a3b8" /> : <ChevronDown size={10} color="#94a3b8" />}
      </div>
      {open && (
        <div className="ind-badge-detail">
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ color: '#64748b' }}>Meta: <b>{meta || '--'}</b></span>
            <span style={{ color: '#64748b' }}>Real: <b style={{ color: realColor, fontWeight: 800 }}>{real || '--'}</b></span>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ MODAL DE BONOS PREMIUM ═══
function BonosModal({ bonos, data, onClose, mode }) {
  if (!bonos || !data) return null;

  const comisiona = bonos.estadoMora && bonos.estadoMora.toLowerCase().includes('comisiona') && !bonos.estadoMora.toLowerCase().includes('no comisiona');
  const smColor = getStatusColor(data.sm3);
  const esMensual = mode === 'mensual';
  const titulo = esMensual ? 'Bonos Mensuales' : 'Bonos Trimestrales';
  const subtitulo = esMensual ? 'Productividad e Indicadores del mes' : 'Productividad del trimestre';

  // Helper local para badge
  const fBadge = (val) => {
    const t = (val || '').toString().toLowerCase();
    let cls = 'badge-soft-neutral';
    if (t.includes('saludable') || t.includes('excelente') || t.includes('bien') || t.includes('cumple')) cls = 'badge-soft-success';
    else if (t.includes('crítico') || t.includes('mal') || t.includes('no cumple')) cls = 'badge-soft-danger';
    else if (t.includes('riesgo')) cls = 'badge-soft-warning';
    
    // Si contiene emoji, asignarlo según el emoji (parche visual)
    if (t.includes('✅')) cls = 'badge-soft-success';
    else if (t.includes('⚠️')) cls = 'badge-soft-warning';
    else if (t.includes('❌') || t.includes('🚫')) cls = 'badge-soft-danger';

    const num = parseFloat(t.replace('%', '').replace(',', '.'));
    if (!isNaN(num)) {
      if (num >= 100) cls = 'badge-soft-success';
      else if (num >= 80) cls = 'badge-soft-warning';
      else cls = 'badge-soft-danger';
    }
    return <span className={`badge-premium ${cls}`}>{val}</span>;
  };

  const getIconForAvance = (avance) => {
    const num = parseFloat((avance || '').toString().replace('%', '').replace(',', '.'));
    if (isNaN(num)) return "-";
    if (num >= 100) return "✅";
    if (num >= 80) return "⚠️";
    return "❌";
  };

  const BonoRow = ({ label, avance, estado, bono }) => {
    const bonoDisplay = bono || '';
    const bonoColor = bonoDisplay && bonoDisplay !== 'S/.0.00' ? '#002d72' : '#94a3b8';
    return (
      <tr>
        <td>{label}</td>
        <td className="metric-val" style={{ textAlign: 'center' }}>{avance || '-'}</td>
        <td style={{ textAlign: 'center' }}>{estado ? fBadge(estado) : (avance ? fBadge(avance) : <span style={{ color: 'var(--text-muted)' }}>-</span>)}</td>
        <td style={{ textAlign: 'center', fontWeight: 800, color: bonoColor }}>{bonoDisplay}</td>
      </tr>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header del Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color="white" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontWeight: 900, color: 'var(--primary-bank)', fontSize: '1.05rem' }}>{titulo}</h4>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{subtitulo}</div>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Estado de Mora y SM */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{
            background: comisiona ? '#eff6ff' : '#fef2f2',
            border: `1px solid ${comisiona ? '#bfdbfe' : '#fecaca'}`,
            borderRadius: '10px', padding: '10px 16px', flex: 1,
            display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px'
          }}>
            {comisiona ? <CheckCircle size={16} color="#002d72" /> : <XCircle size={16} color="#da291c" />}
            <span style={{ fontWeight: 800, color: comisiona ? '#002d72' : '#da291c', fontSize: '0.8rem' }}>
              Mora: {bonos.moraReal} — {bonos.estadoMora}
            </span>
          </div>

          <div style={{
            background: smColor + '10',
            border: `1px solid ${smColor}40`,
            borderRadius: '10px', padding: '10px 16px', flex: 1,
            display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px'
          }}>
            <Coins size={16} color={smColor} />
            <span style={{ fontWeight: 800, color: smColor, fontSize: '0.8rem' }}>
              SM: {data.sm2} / C: {data.sm3}
            </span>
          </div>
        </div>

        {!comisiona ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af', fontSize: '0.85rem' }}>
            La mora actual excede el límite para comisionar. Trabaja en reducirla. 💪
          </div>
        ) : (
          <>
            {/* Card Resumen */}
            <div style={{
              background: esMensual ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              border: `1px solid ${esMensual ? '#bfdbfe' : '#e2e8f0'}`,
              borderRadius: '14px', padding: '16px', textAlign: 'center', marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                {esMensual ? 'Total Bono Mensual' : 'Total Bono Trimestral'}
              </div>
              <div className="bonos-monto" style={{ fontSize: '1.4rem' }}>
                {esMensual ? bonos.bonoMensualTotal : bonos.bonoTrimestralTotal}
              </div>
            </div>

            {esMensual ? (
              <>
                {/* PRODUCTIVIDAD MENSUAL */}
                <div style={{ marginBottom: '14px' }}>
                  <h6 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BarChart3 size={14} /> PRODUCTIVIDAD
                  </h6>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table-premium">
                      <thead><tr><th>Indicador</th><th style={{ textAlign: 'center' }}>Avance</th><th style={{ textAlign: 'center' }}>Estado</th><th style={{ textAlign: 'center' }}>Bono S/.</th></tr></thead>
                      <tbody>
                        <BonoRow label="Saldo Mínimo" avance={bonos.saldoMinimoAvance} estado={bonos.estadoSaldoMinimo} bono="" />
                        <BonoRow label="Saldo Mensual" avance={bonos.saldoMensualAvance} estado={bonos.estadoSaldoMensual} bono={bonos.bonoSaldoMensual} />
                        <BonoRow label="Colocación Mensual" avance={bonos.colocacionMensualAvance} estado={bonos.estadoColocacionMensual} bono={bonos.bonoColocacionMensual} />
                        <tr style={{ background: '#eff6ff' }}>
                          <td colSpan={3} style={{ fontWeight: 900, color: '#1e40af', textAlign: 'right', borderRadius: '12px 0 0 12px' }}>TOTAL PRODUCTIVIDAD</td>
                          <td style={{ textAlign: 'center', fontWeight: 900, fontSize: '1rem', color: '#1e40af', borderRadius: '0 12px 12px 0' }}>{bonos.totalProductividadMensual}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* INDICADORES MENSUAL */}
                <div>
                  <h6 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ClipboardList size={14} /> INDICADORES
                  </h6>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table-premium">
                      <thead><tr><th>Indicador</th><th style={{ textAlign: 'center' }}>Avance</th><th style={{ textAlign: 'center' }}>Estado</th><th style={{ textAlign: 'center' }}>Bono S/.</th></tr></thead>
                      <tbody>
                        <BonoRow label="Tasa Promedio" avance={bonos.tasaPromedioAvance} estado={bonos.estadoTasaPromedio} bono={bonos.bonoTasaPromedio} />
                        <BonoRow label="N° Operaciones" avance={bonos.nOperacionesAvance} estado={bonos.estadoOperaciones} bono={bonos.bonoOperaciones} />
                        <BonoRow label="Clientes Nuevos" avance={bonos.clientesNuevosAvance} estado={bonos.estadoNuevos} bono={bonos.bonoNuevos} />
                        <BonoRow label="Clientes Activos" avance={bonos.clientesActivosAvance} estado={bonos.estadoActivos} bono={bonos.bonoActivos} />
                        <tr style={{ background: '#eff6ff' }}>
                          <td colSpan={3} style={{ fontWeight: 900, color: '#1e40af', textAlign: 'right', borderRadius: '12px 0 0 12px' }}>TOTAL INDICADORES</td>
                          <td style={{ textAlign: 'center', fontWeight: 900, fontSize: '1rem', color: '#1e40af', borderRadius: '0 12px 12px 0' }}>{bonos.totalIndicadoresMensual}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              /* PRODUCTIVIDAD TRIMESTRAL */
              <div>
                <h6 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarCheck size={14} /> PRODUCTIVIDAD TRIMESTRAL
                </h6>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table-premium">
                    <thead><tr><th>Indicador</th><th style={{ textAlign: 'center' }}>Avance</th><th style={{ textAlign: 'center' }}>Estado</th><th style={{ textAlign: 'center' }}>Bono S/.</th></tr></thead>
                    <tbody>
                      <BonoRow label="Saldo Trimestral" avance={bonos.saldoTrimestralAvance} estado={bonos.estadoSaldoTrim} bono="" />
                      <BonoRow label="Colocación Trimestral" avance={bonos.colocacionTrimestralAvance} estado={bonos.estadoColocTrim} bono="" />
                      <tr style={{ background: '#eff6ff' }}>
                        <td colSpan={3} style={{ fontWeight: 900, color: '#1e40af', textAlign: 'right', borderRadius: '12px 0 0 12px' }}>TOTAL TRIMESTRAL</td>
                        <td style={{ textAlign: 'center', fontWeight: 900, fontSize: '1rem', color: '#1e40af', borderRadius: '0 12px 12px 0' }}>{bonos.bonoTrimestralTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══ SUB-VISTA: MENSUAL ═══
function MensualView({ data }) {
  const [showBonos, setShowBonos] = useState(false);
  const moraColor = getMoraColor(data.m2);
  const smColor = getStatusColor(data.sm3);
  const bonos = data.bonos;

  const mensualMap = [
    { l: 'Saldo Cartera', m: data.sc1, r: data.sc2, s: data.sc3 },
    { l: 'Colocaciones', m: data.col1, r: data.col2, s: data.col3 },
    { l: 'Tasa Promedio', m: data.t1, r: data.t2, s: data.t3 },
    { l: 'Operaciones', m: data.o1, r: data.o2, s: data.o3 },
    { l: 'Clt. Nuevos', m: data.cn1, r: data.cn2, s: data.cn3 },
    { l: 'Clt. Activos', m: data.ca1, r: data.ca2, s: data.ca3 }
  ];

  return (
    <div style={{ animation: 'slideUp 0.35s ease-out' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: '8px', marginBottom: '12px' }}>
          <h5 style={{ fontWeight: 800, margin: 0, whiteSpace: 'nowrap', fontSize: '0.95rem' }}>Avance Mensual</h5>
          {bonos && (
            <button onClick={() => setShowBonos(true)} className="btn-ver-bonos-compact">
              <DollarSign size={14} /> Ver Bonos Mensuales
            </button>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-premium">
            <thead>
              <tr>
                <th>Indicador</th>
                <th style={{ textAlign: 'center' }}>Meta</th>
                <th style={{ textAlign: 'center' }}>Real</th>
                <th style={{ textAlign: 'center' }}>Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              {mensualMap.map((item, i) => {
                const color = getStatusColor(item.s);
                return (
                  <tr key={i}>
                    <td>{item.l}</td>
                    <td className="metric-val" style={{ textAlign: 'center' }}>{item.m}</td>
                    <td className="real-val" style={{ textAlign: 'center', color }}>{item.r}</td>
                    <td style={{ textAlign: 'center' }}><GaugeRing value={item.s} color={color} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showBonos && <BonosModal bonos={bonos} data={data} mode="mensual" onClose={() => setShowBonos(false)} />}
    </div>
  );
}

// ═══ SUB-VISTA: TRIMESTRAL ═══
function TrimestralView({ data }) {
  const [showBonos, setShowBonos] = useState(false);
  const moraTriColor = getMoraColor(data.tm2);
  const smTriColor = getStatusColor(data.sm3);
  const bonos = data.bonos;

  const trimData = [
    { l: 'Saldo Cartera', m: data.ts1, r: data.ts2, s: data.ts3 },
    { l: 'Colocaciones', m: data.tc1, r: data.tc2, s: data.tc3 }
  ];

  return (
    <div style={{ animation: 'slideUp 0.35s ease-out' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: '8px', marginBottom: '12px' }}>
          <h5 style={{ fontWeight: 800, margin: 0, whiteSpace: 'nowrap', fontSize: '0.95rem' }}>Metas Trimestrales</h5>
          {bonos && (
            <button onClick={() => setShowBonos(true)} className="btn-ver-bonos-compact">
              <DollarSign size={14} /> Ver Bonos Trimestrales
            </button>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-premium">
            <thead>
              <tr>
                <th>Indicador</th>
                <th style={{ textAlign: 'center' }}>Meta</th>
                <th style={{ textAlign: 'center' }}>Real</th>
                <th style={{ textAlign: 'center' }}>Situación</th>
              </tr>
            </thead>
            <tbody>
              {trimData.map((item, i) => {
                const color = getStatusColor(item.s);
                return (
                  <tr key={i}>
                    <td>{item.l}</td>
                    <td className="metric-val" style={{ textAlign: 'center' }}>{item.m}</td>
                    <td className="real-val" style={{ textAlign: 'center', color }}>{item.r}</td>
                    <td style={{ textAlign: 'center' }}><GaugeRing value={item.s} color={color} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showBonos && <BonosModal bonos={bonos} data={data} mode="trimestral" onClose={() => setShowBonos(false)} />}
    </div>
  );
}

// ═══ INDICATOR TABLE FOR GENERAL (Avance Oficina) ═══
function IndicatorTable({ persona }) {
  const cells = [
    { label: 'Mora', meta: persona.moraMeta || '-', real: persona.moraReal || persona.mora || '-', pct: persona.moraSit || persona.mora || '-', key: true, isMora: true },
    { label: 'Saldo Mín', meta: persona.saldoMinMeta, real: persona.saldoMinReal, pct: persona.saldoMinPct, key: true },
    { label: 'Saldo Cart. (M)', meta: persona.saldoMesMeta, real: persona.saldoMesReal, pct: persona.saldoMesPct },
    { label: 'Saldo Cart. (T)', meta: persona.saldoTriMeta, real: persona.saldoTriReal, pct: persona.saldoTriPct },
    { label: 'Coloc. (M)', meta: persona.colMesMeta, real: persona.colMesReal, pct: persona.colMesPct },
    { label: 'Coloc. (T)', meta: persona.colTriMeta, real: persona.colTriReal, pct: persona.colTriPct },
    { label: 'Tasa Prom.', meta: persona.tasaMeta, real: persona.tasaReal, pct: persona.tasaPct },
    { label: 'Operaciones', meta: persona.opsMeta || 0, real: persona.opsReal || 0, pct: persona.opsPct },
    { label: 'Clt. Nuevos', meta: persona.cltNuevosMeta || 0, real: persona.cltNuevosReal || 0, pct: persona.cltNuevosPct },
    { label: 'Clt. Activos', meta: persona.cltActivosMeta || 0, real: persona.cltActivosReal || 0, pct: persona.cltActivosPct }
  ];

  return (
    <div className="ej-detail-grid">
      {cells.map((c, i) => {
        const color = c.isMora ? getMoraColor(c.pct) : getStatusColor(c.pct);
        return (
          <div key={i} className={`ej-detail-cell${c.key ? ' key-indicator' : ''}`}>
            <div className="ej-detail-cell-label">
              {c.key && '⭐ '}{c.label}
            </div>
            <div className="ej-detail-cell-values">
              <span className="cell-meta">{c.meta}</span>
              <span className="cell-sep">▸</span>
              <span className="cell-real" style={{ color }}>{c.real}</span>
            </div>
            {formatBadge(c.pct)}
          </div>
        );
      })}
    </div>
  );
}

// ═══ EJECUTIVO CARD (Acordeón) ═══
function EjecutivoCard({ persona, pos, isAdmin, isOpen, onToggle }) {
  const moraDotColor = getMoraColor(persona.moraSit || persona.mora);
  const colPctRaw = parseFloat((persona.colMesPct || '0').replace('%', '').replace(',', '.')) || 0;
  const colPct = Math.min(colPctRaw, 100);
  const colColor = colPctRaw >= 90 ? '#002d72' : colPctRaw >= 60 ? '#3b82f6' : '#da291c';

  return (
    <div className={`ej-card${isAdmin ? ' admin-card' : ''}`}>
      <div className="ej-card-header" onClick={onToggle}>
        <div style={{
          width: '26px', height: '26px', borderRadius: isAdmin ? '10px' : '50%',
          background: isAdmin ? 'var(--grad-primary)' : '#e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontSize: '0.7rem', fontWeight: 800, color: isAdmin ? 'white' : '#475569'
        }}>
          {isAdmin ? '🏛️' : `${pos}°`}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#002d72', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: moraDotColor, flexShrink: 0, boxShadow: `0 0 4px ${moraDotColor}40` }} />
            {isAdmin ? 'META DE OFICINA' : shortName(persona.nombre)}
            {isAdmin && <span style={{ background: 'var(--grad-primary)', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.5rem', fontWeight: 800, marginLeft: '6px', letterSpacing: '0.5px' }}>ADMIN</span>}
          </div>
          <div style={{ fontSize: '0.6rem', color: isAdmin ? '#1e40af' : '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            {isAdmin ? persona.oficina : (persona.categoria || '')}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, minWidth: '80px' }}>
          <div className="progress-bar-compact">
            <div className="progress-bar-fill" style={{ width: `${colPct}%`, background: colColor }} />
          </div>
          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: colColor, minWidth: '28px', textAlign: 'right' }}>{persona.colMesPct || '0%'}</span>
        </div>
        {isOpen ? <ChevronUp size={14} color={isAdmin ? '#1e40af' : '#94a3b8'} /> : <ChevronDown size={14} color={isAdmin ? '#1e40af' : '#94a3b8'} />}
      </div>
      {isOpen && (
        <div className="ej-detail-panel">
          <IndicatorTable persona={persona} />
        </div>
      )}
    </div>
  );
}

// ═══ SUB-VISTA: GENERAL (AVANCE OFICINA) ═══
function GeneralView({ data }) {
  const [loading, setLoading] = useState(false);
  const [avanceData, setAvanceData] = useState(null);
  const [selectedOficina, setSelectedOficina] = useState(data.oficina);
  const [openId, setOpenId] = useState(null);

  const avance = avanceData || data.avanceOficina || { ejecutivos: [], admins: [] };
  const todosEjecutivos = avance.ejecutivos || [];
  const admins = avance.admins || [];
  const miNombre = (data.nombre || '').trim().toLowerCase();
  const esGerencia = data.esGerencia || false;
  const listaOficinas = data.oficinas || [];

  const ejecutivos = esGerencia
    ? todosEjecutivos
    : todosEjecutivos.filter(ej => ej.nombre.trim().toLowerCase() !== miNombre);
  const totalPersonas = ejecutivos.length + admins.length;

  const cambiarOficina = async (oficina) => {
    setSelectedOficina(oficina);
    setLoading(true);
    try {
      const result = await callGAS('getAvanceOficina', [oficina]);
      setAvanceData(result || { ejecutivos: [], admins: [] });
    } catch (err) {
      console.error('Error cambio oficina:', err);
    }
    setLoading(false);
  };

  if (totalPersonas === 0 && !loading) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Users size={42} color="#94a3b8" style={{ marginBottom: '12px', opacity: 0.3 }} />
        <h5 style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Sin datos de oficina</h5>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No se encontraron colaboradores de tu oficina.</p>
      </div>
    );
  }

  return (
    <div style={{ animation: 'slideUp 0.35s ease-out' }}>
      {/* Header con selector */}
      <div className="glass-card" style={{ padding: '8px 12px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
            <Building2 size={14} color="#2563eb" />
            {esGerencia && listaOficinas.length > 1 ? (
              <select className="campaign-dropdown" value={selectedOficina} onChange={(e) => cambiarOficina(e.target.value)}>
                {listaOficinas.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-bank)' }}>
                AVANCE OFICINA: {selectedOficina}
              </span>
            )}
          </div>
          <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontSize: '0.6rem', fontWeight: 800, border: '1px solid #bfdbfe' }}>
            <Users size={10} style={{ marginRight: '4px' }} />{totalPersonas} COLABORADORES
          </span>
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Loader2 size={32} className="spin-anim" color="var(--primary-bank)" />
          <div style={{ fontWeight: 700, color: 'var(--primary-bank)', fontSize: '0.85rem', marginTop: '12px' }}>Cargando oficina {selectedOficina}...</div>
        </div>
      ) : esGerencia ? (
        // GERENCIA: Lista unificada
        [...admins, ...ejecutivos]
          .sort((a, b) => (Number(b.opsReal) || 0) - (Number(a.opsReal) || 0))
          .map((persona, idx) => {
            const id = persona.nombre + idx;
            return <EjecutivoCard key={idx} persona={persona} pos={idx + 1} isAdmin={persona.esAdmin} isOpen={openId === id} onToggle={() => setOpenId(openId === id ? null : id)} />;
          })
      ) : (
        <>
          {/* Admin separado */}
          {admins.length > 0 && <EjecutivoCard persona={admins[0]} pos={0} isAdmin={true} isOpen={openId === 'admin_0'} onToggle={() => setOpenId(openId === 'admin_0' ? null : 'admin_0')} />}
          {/* Ejecutivos */}
          {ejecutivos.map((ej, idx) => {
             const id = ej.nombre + idx;
             return <EjecutivoCard key={idx} persona={ej} pos={idx + 1} isAdmin={false} isOpen={openId === id} onToggle={() => setOpenId(openId === id ? null : id)} />;
          })}
        </>
      )}
    </div>
  );
}

// ═══ COMPONENTE PRINCIPAL: METAS TAB ═══
export default function MetasTab({ data }) {
  const [subView, setSubView] = useState('mensual');

  if (!data) return null;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Sub-navegación */}
      <div className="glass-card" style={{ padding: '8px 12px' }}>
        <div className="sub-nav-wrapper">
          <button className={`sub-nav-btn${subView === 'mensual' ? ' active' : ''}`} onClick={() => setSubView('mensual')}>
            <Calendar size={14} /> Mensual
          </button>
          <button className={`sub-nav-btn${subView === 'trimestral' ? ' active' : ''}`} onClick={() => setSubView('trimestral')}>
            <TrendingUp size={14} /> Trimestral
          </button>
          <button className={`sub-nav-btn${subView === 'general' ? ' active' : ''}`} onClick={() => setSubView('general')}>
            <Users size={14} /> General
          </button>
        </div>
      </div>

      {subView === 'mensual' && <MensualView data={data} />}
      {subView === 'trimestral' && <TrimestralView data={data} />}
      {subView === 'general' && <GeneralView data={data} />}
    </div>
  );
}
