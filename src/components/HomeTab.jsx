import { ShieldAlert, FileSignature, Coins, Trophy, AlertTriangle, CheckCircle, Info, Medal, Clock } from 'lucide-react';

export default function HomeTab({ data }) {
  if (!data) return null;

  // Helpers (Semaforos idénticos a los del GAS original)
  const parsePct = (v) => {
    if (!v) return 0;
    return parseFloat(v.toString().replace('%', '').replace(',', '.')) || 0;
  };

  const getSemaforo = (pct, invertir) => {
    if (invertir) { // Para MORA: menos es mejor
      if (pct <= 2.5) return { color: '#10b981', txt: 'Saludable' };
      if (pct <= 3.5) return { color: '#f59e0b', txt: 'En Riesgo' };
      return { color: '#ef4444', txt: 'Crítico' };
    }
    // Para OPERACIONES/COLOCACION: más es mejor
    if (pct >= 100) return { color: '#10b981', txt: 'Cumplido' };
    if (pct >= 80) return { color: '#f59e0b', txt: 'En Progreso' };
    return { color: '#ef4444', txt: 'Por Mejorar' };
  };

  // Cálculos
  const moraVal = parsePct(data.m1);
  const moraSem = getSemaforo(moraVal, true);

  const opsReal = Number(data.o2) || 0;
  const opsMeta = Number(data.o1) || 0;
  const opsPct = opsMeta > 0 ? Math.round((opsReal / opsMeta) * 100) : 0;
  const opsSem = getSemaforo(opsPct, false);

  const colPct = parsePct(data.col3);
  const colSem = getSemaforo(colPct, false);

  // Lógica Campaña Activa
  const campanias = data.campanias || [];
  const activas = campanias.filter(c => c.activa);
  let campTexto = 'Sin campaña';
  let campSub = 'No hay campañas activas';
  let CampIcon = Trophy;
  
  if (activas.length > 0) {
    const camp = activas[0];
    if (camp.miPuesto > 0) {
      const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
      campTexto = (medals[camp.miPuesto] || '') + ' ' + camp.miPuesto + '° Lugar';
      campSub = camp.name;
    } else {
      campTexto = 'No Clasificado';
      campSub = camp.name;
      CampIcon = Clock;
    }
  }

  // Lógica Bonos Resumen
  const bonos = data.bonos;
  const comisiona = bonos && bonos.estadoMora.toLowerCase().includes('comisiona') && !bonos.estadoMora.toLowerCase().includes('no comisiona');

  return (
    <div className="home-tab-wrapper" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* GRID Principal de KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        
        {/* MORA */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} /> MORA ACTUAL
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
            {data.m1 || '0.00%'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: moraSem.color }}></span>
            {moraSem.txt} · Meta: {data.m0 || '---'}
          </div>
        </div>

        {/* OPERACIONES */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileSignature size={14} /> OPERACIONES
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
            {opsReal} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {opsMeta}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opsSem.color }}></span>
            {opsSem.txt} · {opsPct}%
          </div>
        </div>

        {/* COLOCACION */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Coins size={14} /> COLOCACIÓN
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
            {data.col2 || 'S/. 0'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colSem.color }}></span>
            {colSem.txt} · {data.col3 || '0%'}
          </div>
        </div>

        {/* CAMPAÑA */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-bank)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CampIcon size={14} /> CAMPAÑA
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.2 }}>
            {campTexto}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {campSub}
          </div>
        </div>

      </div>

      {/* SECCIÓN INFERIOR: RESUMEN DE BONOS Y ALERTAS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' } }}>
        
        {/* RESUMEN BONOS */}
        <div className="glass-card">
           <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-bank)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px' }}>
             PROYECCIÓN DE BONOS
           </h5>
           {bonos ? (
             <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
               <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Mensual</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-bank)' }}>{bonos.bonoMensualTotal || 'S/.0.00'}</div>
               </div>
               <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Trimestral</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#166534' }}>{bonos.bonoTrimestralTotal || 'S/.0.00'}</div>
               </div>
               <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Filtro de Mora</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: comisiona ? '#166534' : '#991b1b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {comisiona ? <CheckCircle size={14}/> : <AlertTriangle size={14}/>} {bonos.estadoMora}
                  </div>
               </div>
             </div>
           ) : (
             <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No hay datos de bonos disponibles.</div>
           )}
        </div>

      </div>
    </div>
  );
}
