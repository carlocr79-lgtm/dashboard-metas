import { Clock, RefreshCw, BadgeInfo, Star, Building2 } from 'lucide-react';

export default function Header({ userData, isSyncing, lastSync, onSync }) {
  if (!userData) return null;

  // Extraer iniciales (ej: Carlos Lopez => CL)
  const nameParts = userData.nombre ? userData.nombre.trim().split(/\s+/) : ['U', ''];
  const initials = (nameParts[0].charAt(0) + (nameParts[1] ? nameParts[1].charAt(0) : '')).toUpperCase();
  const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();

  return (
    <header className="glass-header" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', color: 'white', background: 'var(--primary-bank)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '3px solid white'
        }}>
          {initials}
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-bank)', fontSize: '1.4rem' }}>
            Hola, {firstName}
            <span style={{ color: '#475569', fontSize: '0.9rem', marginLeft: '8px', fontWeight: 500, display: 'inline-block' }}>
              Bienvenido al Centro de Control
            </span>
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#475569', fontSize: '0.85rem', fontWeight: 600, marginTop: '8px', flexWrap: 'wrap' }}>
             <span style={{ display: 'flex', alignItems: 'center' }}>
               <BadgeInfo size={16} color="var(--primary-bank)" style={{marginRight: 4}}/> 
               {userData.codigo || "EJECUTIVO"}
             </span>
             <span style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0' }}>
               <Star size={14} fill="#f59e0b" color="#f59e0b" style={{marginRight: 4}}/> 
               {userData.categoria || "N/A"}
             </span>
             <span style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0' }}>
               <Building2 size={14} color="#0ea5e9" style={{marginRight: 4}}/> 
               {userData.oficina || "OFICINA"}
             </span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', justifyContent: 'center' }}>
         <div style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
            <Clock size={12} style={{marginRight: 4}}/> ACTUALIZACIÓN MANUAL
         </div>
         <button 
           onClick={onSync}
           disabled={isSyncing}
           style={{ 
             background: isSyncing ? '#dbeafe' : '#f8fafc', 
             color: '#2563eb', 
             padding: '6px 12px', 
             borderRadius: '20px', 
             fontWeight: 800, 
             fontSize: '0.75rem', 
             display: 'flex', 
             alignItems: 'center',
             border: '1px solid #bfdbfe',
             cursor: isSyncing ? 'not-allowed' : 'pointer',
             transition: 'all 0.2s',
             boxShadow: '0 2px 4px rgba(37, 99, 235, 0.1)',
             opacity: isSyncing ? 0.7 : 1
           }}
           onMouseEnter={(e) => {
             if (!isSyncing) e.currentTarget.style.background = '#eff6ff';
           }}
           onMouseLeave={(e) => {
             if (!isSyncing) e.currentTarget.style.background = '#f8fafc';
           }}
         >
            <RefreshCw size={14} className={isSyncing ? "spin-anim" : ""} style={{marginRight: 6}}/> 
            {isSyncing ? 'Sincronizando...' : `Refrescar (${lastSync})`}
         </button>
      </div>
    </header>
  );
}
