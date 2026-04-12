import { Home, Target, Megaphone, DollarSign, FileText, Activity, LayoutDashboard, BadgeInfo } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, userData }) {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'metas', label: 'Metas', icon: Target },
    { id: 'campana', label: 'Campañas', icon: Megaphone },
    { id: 'bonos', label: 'Bonos', icon: DollarSign },
    { id: 'boletas', label: 'Boletas', icon: FileText }
  ];

  // Extraer nombre para el perfil en Desktop
  const nameParts = userData?.nombre ? userData.nombre.trim().split(/\s+/) : ['U', ''];
  const initials = (nameParts[0].charAt(0) + (nameParts[1] ? nameParts[1].charAt(0) : '')).toUpperCase();
  const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();

  return (
    <aside className="sidebar-container">
      {/* BRAND (Logo) - Solo Visible en Desktop */}
      <div className="sidebar-brand">
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-bank)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Activity size={20} />
        </div>
        <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary-bank)', letterSpacing: '-0.5px' }}>
          METAS
        </div>
      </div>

      {/* USER PROFILE - Solo Visible en Desktop */}
      {userData && (
        <div className="sidebar-profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 800, color: 'white', background: 'var(--grad-primary)',
              boxShadow: '0 4px 10px rgba(0, 45, 114, 0.15)'
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-bank)', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {firstName}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                {userData.categoria || 'N/A'}
              </div>
            </div>
          </div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#1e40af', fontSize: '0.7rem', fontWeight: 800 }}>
            <BadgeInfo size={12} /> {userData.codigo || "EJECUTIVO"}
          </div>
        </div>
      )}

      {/* NAVEGACIÓN */}
      <nav className="sidebar-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sidebar-btn ${isActive ? 'active' : ''}`}
            >
              <div className="icon-wrapper">
                <Icon size={18} />
              </div>
              <span className={isActive ? 'hide-on-mobile' : 'hide-on-mobile' /* Always hide text on mobile to save vertical space if possible or allow it to wrap */ } 
                style={{ display: 'block', marginTop: '2px', overflow: 'hidden' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
