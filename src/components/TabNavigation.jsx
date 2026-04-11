import { Home, Users, Flag, FileText } from 'lucide-react';

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'general', label: 'General', icon: Users },
    { id: 'campana', label: 'Campaña', icon: Flag },
    { id: 'bonos', label: 'Boletas', icon: FileText }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 16px', maxWidth: '850px', width: '100%' }}>
      <div style={{
        background: '#ffffff',
        padding: '5px',
        borderRadius: '12px',
        display: 'flex',
        gap: '8px',
        width: '100%',
        boxShadow: '0 4px 15px rgba(0, 45, 114, 0.05)',
        border: '1px solid rgba(0, 45, 114, 0.08)'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: isActive ? 'var(--primary-bank)' : '#f1f5f9',
                color: isActive ? 'white' : '#64748b',
                border: '1px solid transparent',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isActive ? '0 8px 20px rgba(0, 45, 114, 0.2)' : 'none',
                transform: isActive ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <Icon size={18} />
              <span className="hide-on-mobile">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
