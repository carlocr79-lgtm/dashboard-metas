import { Clock, RefreshCw, BadgeInfo, Star, Building2, LogOut } from 'lucide-react';

export default function Header({ userData, isSyncing, lastSync, onSync, onLogout }) {
  if (!userData) return null;

  // Extraer iniciales (ej: Carlos Lopez => CL)
  const nameParts = userData.nombre ? userData.nombre.trim().split(/\s+/) : ['U', ''];
  const initials = (nameParts[0].charAt(0) + (nameParts[1] ? nameParts[1].charAt(0) : '')).toUpperCase();
  const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();

  return (
    <header className="glass-header" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '54px', height: '54px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', color: 'white', background: 'var(--primary-bank)',
          boxShadow: '0 4px 10px rgba(0, 45, 114, 0.15)', border: '2px solid white'
        }}>
          {initials}
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-bank)', fontSize: '1.2rem', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
            Hola, {firstName}
          </h3>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
            Bienvenido al Centro de Control
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#475569', fontSize: '0.85rem', fontWeight: 600, marginTop: '8px', flexWrap: 'wrap' }}>
             <span style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
               <BadgeInfo size={14} color="var(--primary-bank)" style={{marginRight: 4}}/> 
               {userData.codigo || "EJECUTIVO"}
             </span>
             <span style={{ display: 'flex', alignItems: 'center', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px', border: '1px solid #bfdbfe', color: '#1e40af' }}>
               <Star size={12} fill="#3b82f6" color="#3b82f6" style={{marginRight: 4}}/> 
               {userData.categoria || "N/A"}
             </span>
             <span style={{ display: 'flex', alignItems: 'center', background: '#f0f9ff', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e0f2fe' }}>
               <Building2 size={12} color="#0284c7" style={{marginRight: 4}}/> 
               {userData.oficina || "OFICINA"}
             </span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
         <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Actualizado <span style={{ fontWeight: 800, color: '#64748b' }}>{lastSync}</span>
         </div>
         
         <div style={{ display: 'flex', gap: '6px' }}>
           <button 
             onClick={onSync}
             title="Sincronizar datos"
             disabled={isSyncing}
             style={{ 
               background: isSyncing ? '#eff6ff' : '#f8fafc', 
               color: isSyncing ? '#3b82f6' : '#64748b', 
               padding: '8px', 
               borderRadius: '8px', 
               border: '1px solid',
               borderColor: isSyncing ? '#bfdbfe' : '#e2e8f0',
               cursor: isSyncing ? 'not-allowed' : 'pointer',
               transition: 'all 0.2s',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}
             onMouseEnter={(e) => {
               if (!isSyncing) {
                 e.currentTarget.style.background = '#f1f5f9';
                 e.currentTarget.style.color = '#334155';
               }
             }}
             onMouseLeave={(e) => {
               if (!isSyncing) {
                 e.currentTarget.style.background = '#f8fafc';
                 e.currentTarget.style.color = '#64748b';
               }
             }}
           >
              <RefreshCw size={16} className={isSyncing ? "spin-anim" : ""} /> 
           </button>
           
           {onLogout && (
             <button
               onClick={onLogout}
               title="Cerrar sesión"
               style={{
                 background: '#fee2e2',
                 color: '#da291c',
                 padding: '8px',
                 borderRadius: '8px',
                 border: '1px solid #fecaca',
                 cursor: 'pointer',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 transition: 'all 0.2s',
               }}
               onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
               onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
             >
               <LogOut size={16} />
             </button>
           )}
         </div>
      </div>
    </header>
  );
}
