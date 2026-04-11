import { Trophy, Info, Sparkles } from 'lucide-react';

export default function CampaignTab({ data }) {
  const campanias = Array.isArray(data?.campanias) ? data.campanias : [];
  
  if (!data || campanias.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Trophy size={48} color="#cbd5e1" />
        <h4 style={{ color: 'var(--text-muted)' }}>No hay campañas activas</h4>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>En este momento no hay campañas de premios disponibles. Revisa esta sección más adelante.</p>
      </div>
    );
  }

  // Por ahora, renderizamos la primera activa
  const camp = campanias[0];
  const rankingList = Array.isArray(camp.ranking) ? camp.ranking : [];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Cabecera Campaña */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderLeft: '4px solid var(--rojo-corporativo)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Trophy size={28} color="var(--rojo-corporativo)" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-bank)', textTransform: 'uppercase' }}>
              {camp.name}
            </h2>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Actualizado hoy
            </p>
          </div>
        </div>

        {camp.miPuesto > 0 && (
          <div style={{ 
            background: camp.miPuesto === 1 ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 
                        camp.miPuesto === 2 ? 'linear-gradient(135deg, #94a3b8, #475569)' :
                        camp.miPuesto === 3 ? 'linear-gradient(135deg, #d97706, #78350f)' : 'var(--bg-body)',
            color: camp.miPuesto <= 3 ? 'white' : 'var(--text-main)',
            padding: '6px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
             MI PUESTO: {camp.miPuesto}°
          </div>
        )}
      </div>

      {/* Requisitos y Estado personal */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '16px', background: 'rgba(255, 255, 255, 0.98)' }}>
        <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '12px' }}>
          <Info size={14} style={{ marginRight: '6px' }} />REQUISITOS DE CLASIFICACIÓN
        </h5>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>
             Mora Máxima Permitida: <span style={{ color: '#ef4444', fontWeight: 800 }}>{camp.moraMax}%</span>
          </div>
          <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>
             Clasifican los: <span style={{ color: 'var(--primary-bank)', fontWeight: 800 }}>Top {camp.topGanadores}</span>
          </div>
        </div>
      </div>

      {/* Ranking List */}
      <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary-bank)', marginBottom: '12px', marginLeft: '4px' }}>🏆 TABLA DE POSICIONES</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {rankingList.map((ej, index) => {
          const pos = index + 1;
          const isGold = pos === 1;
          const isSilver = pos === 2;
          const isBronze = pos === 3;
          
          let pStyle = { background: 'white', color: 'var(--text-muted)' };
          if (isGold) pStyle = { background: '#fefce8', color: '#a16207', border: '1px solid #fef08a' };
          if (isSilver) pStyle = { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
          if (isBronze) pStyle = { background: '#fff7ed', color: '#9a3412', border: '1px solid #ffedd5' };

          const isMe = data.nombre && ej.nombre && data.nombre.toLowerCase() === ej.nombre.toLowerCase();

          return (
            <div key={index} className="glass-card" style={{ 
              padding: '12px 16px', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '12px', 
              border: isMe ? '2px solid var(--primary-bank)' : '',
              transform: isMe ? 'scale(1.02)' : 'scale(1)',
              zIndex: isMe ? 2 : 1
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', ...pStyle }}>
                {isGold ? '👑' : isSilver ? '🥈' : isBronze ? '🥉' : `${pos}°`}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {ej.nombre} {isMe && <Sparkles size={14} color="#f59e0b" />}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {ej.oficina}
                </div>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>OPS</div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.85rem' }}>{ej.ops}</div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>COLOCACIÓN</div>
                <div style={{ fontWeight: 900, color: 'var(--primary-bank)', fontSize: '0.9rem' }}>{ej.colocacionTexto}</div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
