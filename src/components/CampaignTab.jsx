import { useState, useEffect } from 'react';
import { Trophy, Info, TrendingUp, Sparkles, Clock, X } from 'lucide-react';
import confetti from 'canvas-confetti';

// ═══ HELPERS ═══
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

function getProgressColor(pctStr) {
  const pct = parseFloat(pctStr) || 0;
  if (pct >= 100) return '#10b981';
  if (pct >= 80) return '#f59e0b';
  return '#ef4444';
}

// ═══ SUB-VISTA: CONDICIONES ═══
function CondicionesView({ camp }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="glass-card">
        <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '12px' }}>CONSIDERACIONES DE LA CAMPAÑA</h5>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {camp.tipo && (
              <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📅 <strong>Tipo:</strong> Contabilización <strong>{camp.tipo}</strong>.
              </li>
            )}
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ <strong>Mora Máxima:</strong> Para calificar, la mora debe ser ≤ <strong>{camp.moraMax}%</strong>.
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📋 <strong>Operaciones Mínimas:</strong> Se requiere un mínimo de <strong>{camp.opsMin} operaciones</strong>.
            </li>
            {camp.desempate && (
              <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚖️ <strong>Desempate:</strong> {camp.desempate}.
              </li>
            )}
            <li style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span>🎁</span>
                <div>
                  <strong>Premios por Ranking:</strong>
                  <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#fbbf24', color: '#78350f', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>🏆 1° Oro</span>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>S/. {Number(camp.premios?.[0] || 0).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#94a3b8', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>🥈 2° Plata</span>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>S/. {Number(camp.premios?.[1] || 0).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#cd7f32', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>🥉 3° Bronce</span>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>S/. {Number(camp.premios?.[2] || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              🕐 <strong>Vigencia:</strong> {camp.periodo}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ═══ SUB-VISTA: AVANCE PERSONAL ═══
function AvanceView({ camp, data }) {
  const barColor = getProgressColor(data.co3);
  
  let topRankHtml = null;
  if (camp.miPuesto > 0) {
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    const topColors = {
      1: { color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', border: 'rgba(217, 119, 6, 0.2)' },
      2: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', border: 'rgba(100, 116, 139, 0.2)' },
      3: { color: '#b45309', bg: 'rgba(180, 83, 9, 0.1)', border: 'rgba(180, 83, 9, 0.2)' },
    };
    const tc = topColors[camp.miPuesto] || { color: '#1e3a8a', bg: 'rgba(30, 58, 138, 0.1)', border: 'rgba(30, 58, 138, 0.2)' };
    topRankHtml = (
      <span className="badge-premium" style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`, display: 'flex', alignItems: 'center', gap: '5px' }}>
        TU POSICIÓN: <strong style={{ fontSize: '1.1em' }}>{camp.miPuesto}° LUGAR {medals[camp.miPuesto] || ''}</strong>
      </span>
    );
  } else {
    topRankHtml = (
      <span className="badge-premium" style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }}>
        <Clock size={12} /> NO CLASIFICADO
      </span>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-bank)', fontSize: '0.9rem' }}>AVANCE: {camp.name}</h5>
          {topRankHtml}
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
              <tr>
                <td style={{ fontWeight: 700 }}>Mora</td>
                <td className="metric-val" style={{ textAlign: 'center' }}>{data.cm0 || (camp.moraMax + '%')}</td>
                <td style={{ textAlign: 'center', fontWeight: 800, color: parseFloat(data.cm1) <= camp.moraMax ? '#10b981' : '#ef4444' }}>{data.cm1}</td>
                <td style={{ textAlign: 'center' }}>{formatBadge(data.cm2 || '---')}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Meta (OP)</td>
                <td className="metric-val" style={{ textAlign: 'center' }}>{data.co1 || camp.opsMin}</td>
                <td style={{ textAlign: 'center', fontWeight: 800, color: barColor }}>{data.co2}</td>
                <td style={{ textAlign: 'center' }}>{formatBadge(data.co3)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Saldo</td>
                <td className="metric-val" style={{ textAlign: 'center' }}>{data.cs1 || '---'}</td>
                <td style={{ textAlign: 'center', fontWeight: 800, color: '#10b981' }}>{data.cs2}</td>
                <td style={{ textAlign: 'center' }}>{formatBadge(data.cs3)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══ SUB-VISTA: RANKING ═══
function RankingView({ camp, data }) {
  const [firedConfetti, setFiredConfetti] = useState(false);

  const clasificados = camp.ranking?.clasificados || [];
  const descalificados = camp.ranking?.descalificados || [];

  // Construir lista visual: al menos 5 items
  let listaVisual = [...clasificados];
  if (listaVisual.length < 5) {
    const faltantes = 5 - listaVisual.length;
    const topDesc = descalificados.slice(0, faltantes).map(d => ({ ...d, isDescalificado: true }));
    listaVisual = listaVisual.concat(topDesc);
  } else {
    listaVisual = listaVisual.slice(0, 5);
  }

  // Confetti effect
  useEffect(() => {
    if (!firedConfetti && clasificados.length > 0 && data?.nombre) {
      const first = clasificados[0];
      if (first.nombre.toLowerCase() === data.nombre.toLowerCase()) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setFiredConfetti(true);
      }
    }
  }, [clasificados, data?.nombre, firedConfetti]);

  if (listaVisual.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
        Aún no hay datos en el Ranking.
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h5 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>RANKING DE LA CAMPAÑA</h5>
          <div style={{ fontSize: '0.65rem', background: '#fff7ed', color: '#9a3412', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, border: '1px solid #fed7aa' }}>
            ACTUALIZADO AHORA
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {listaVisual.map((ej, idx) => {
            const pos = idx + 1;
            const isMe = data?.nombre && ej.nombre && data.nombre.toLowerCase() === ej.nombre.toLowerCase();

            if (ej.isDescalificado) {
              return (
                <div key={idx} className="ranking-item descalificado">
                  <div className="puesto-box disqualified"><X size={16} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#991b1b' }}>{ej.nombre}</div>
                    <div style={{ fontSize: '0.6rem', color: '#ef4444' }}>{ej.mensajeError || 'No califica'}</div>
                  </div>
                  <div className="stats-pill">
                    <span className="label">OPS</span>
                    <span className="value">{ej.ops}</span>
                  </div>
                  <div className="stats-pill hide-mobile">
                    <span className="label">MORA</span>
                    <span className="value" style={{ color: '#ef4444' }}>{ej.moraTexto}</span>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '70px' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>COLOCACIÓN</div>
                    <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.85rem' }}>{ej.colocacionTexto || '---'}</div>
                  </div>
                </div>
              );
            }

            const pClass = pos === 1 ? 'gold' : pos === 2 ? 'silver' : pos === 3 ? 'bronze' : 'other';
            const icon = pos === 1 ? '👑' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : `${pos}°`;
            const moraColor = parseFloat(ej.moraTexto) <= camp.moraMax ? '#16a34a' : '#ef4444';

            return (
              <div key={idx} className={`ranking-item${isMe ? ' is-me' : ''}`}>
                <div className={`puesto-box ${pClass}`}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {ej.nombre} {isMe && <Sparkles size={14} color="#f59e0b" />}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {ej.oficina}
                  </div>
                </div>
                <div className="stats-pill">
                  <span className="label">OPERACIONES</span>
                  <span className="value">{ej.ops}</span>
                </div>
                <div className="stats-pill hide-mobile">
                  <span className="label">MORA</span>
                  <span className="value" style={{ color: moraColor }}>{ej.moraTexto}</span>
                </div>
                <div style={{ textAlign: 'right', minWidth: '70px' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>COLOCACIÓN</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary-bank)', fontSize: '0.85rem' }}>{ej.colocacionTexto}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══ COMPONENTE PRINCIPAL ═══
export default function CampaignTab({ data }) {
  const [subView, setSubView] = useState('consideraciones');
  const [selectedCampIdx, setSelectedCampIdx] = useState(0);

  const campanias = Array.isArray(data?.campanias) ? data.campanias : [];
  const campaignsList = campanias.filter(c => c.activa);

  if (!data || campaignsList.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Trophy size={48} color="#cbd5e1" style={{ opacity: 0.3 }} />
        <h5 style={{ fontWeight: 800, color: 'var(--text-muted)' }}>No hay campañas activas</h5>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Actualmente no existe ninguna campaña vigente. Cuando se active una nueva campaña, aparecerá aquí.</p>
      </div>
    );
  }

  const camp = campaignsList[selectedCampIdx] || campaignsList[0];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Selector de campañas (si hay más de 1) */}
      {campaignsList.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <select className="campaign-dropdown" value={selectedCampIdx} onChange={(e) => { setSelectedCampIdx(Number(e.target.value)); setSubView('consideraciones'); }}>
            {campaignsList.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* Header de Campaña */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderLeft: '4px solid var(--rojo-corporativo)', marginBottom: '0' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Trophy size={32} color="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#b45309', opacity: 0.9, letterSpacing: '2px' }}>
              {camp.activa ? 'CAMPAÑA ACTIVA' : 'CAMPAÑA FINALIZADA'}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#d97706', lineHeight: 1 }}>
              {camp.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Sub-navegación */}
      <div className="glass-card" style={{ padding: '8px 12px' }}>
        <div className="sub-nav-wrapper">
          <button className={`sub-nav-btn${subView === 'consideraciones' ? ' active' : ''}`} onClick={() => setSubView('consideraciones')}>
            <Info size={14} /> Condiciones
          </button>
          <button className={`sub-nav-btn${subView === 'avance' ? ' active' : ''}`} onClick={() => setSubView('avance')}>
            <TrendingUp size={14} /> Avance
          </button>
          <button className={`sub-nav-btn${subView === 'ranking' ? ' active' : ''}`} onClick={() => setSubView('ranking')}>
            <Trophy size={14} /> Ranking
          </button>
        </div>
      </div>

      {subView === 'consideraciones' && <CondicionesView camp={camp} />}
      {subView === 'avance' && <AvanceView camp={camp} data={data} />}
      {subView === 'ranking' && <RankingView camp={camp} data={data} />}
    </div>
  );
}
