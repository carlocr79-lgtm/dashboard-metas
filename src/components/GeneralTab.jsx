import { LayoutList, Activity, Users } from 'lucide-react';

export default function GeneralTab({ data }) {
  if (!data) return null;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      <div className="glass-card" style={{ marginBottom: '16px' }}>
        <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-bank)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '2px solid var(--glass-border)', paddingBottom: '12px' }}>
          <LayoutList size={18} color="var(--primary-bank)" /> DETALLE GENERAL AL {new Date().toLocaleDateString('es-PE')}
        </h5>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <Activity size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
          <h6 style={{ color: 'var(--text-main)', fontWeight: 800, margin: '0 0 8px 0' }}>Panel de Detalles Expandidos</h6>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Este módulo actuará como un desglose analítico de toda tu oficina, permitiendo ver las estadísticas de otros asesores filtrando por regiones si tu rol tiene permisos directivos.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '16px' }}>
          {/* Tarjeta Mock */}
          <div style={{ background: 'white', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #cbd5e1' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} color="#3b82f6" />
            </div>
            <div>
               <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Equipo SAN ISIDRO</div>
               <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary-bank)' }}>12 Asesores Activos</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
