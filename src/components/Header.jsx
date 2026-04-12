import { Clock, RefreshCw, LogOut } from 'lucide-react';

export default function Header({ userData, isSyncing, lastSync, onSync, onLogout }) {
  if (!userData) return null;

  return (
    <header className="glass-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
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
