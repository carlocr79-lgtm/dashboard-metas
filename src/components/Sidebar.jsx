import { Home, Target, Megaphone, DollarSign, FileText } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'metas', label: 'Metas', icon: Target },
    { id: 'campana', label: 'Campañas', icon: Megaphone },
    { id: 'bonos', label: 'Bonos', icon: DollarSign },
    { id: 'boletas', label: 'Boletas', icon: FileText }
  ];

  return (
    <aside className="sidebar-container">
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
