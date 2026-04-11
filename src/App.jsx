import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import './styles/variables.css';
import './styles/components.css';

import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import HomeTab from './components/HomeTab';
import CampaignTab from './components/CampaignTab';
import GeneralTab from './components/GeneralTab';
import BoletasTab from './components/BoletasTab';
import LoginOTP from './components/LoginOTP';
import ErrorBoundary from './components/ErrorBoundary';

function Dashboard({ data, userEmail }) {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div style={{ width: '100%', animation: 'fadeInScale 0.6s ease-out' }}>
      <Header 
        userData={data} 
        isSyncing={isSyncing} 
        lastSync={new Date().toLocaleTimeString('es-PE', {hour: '2-digit', minute:'2-digit'})} 
      />
      
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button onClick={handleRefresh} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
             <RefreshCw size={14} /> Refrescar Panel
          </button>
        </div>

        <ErrorBoundary>
          {activeTab === 'inicio' && <HomeTab data={data} />}
          {activeTab === 'general' && <GeneralTab data={data} />}
          {activeTab === 'campana' && <CampaignTab data={data} />}
          {activeTab === 'bonos' && <BoletasTab data={data} />}
        </ErrorBoundary>
      </main>
    </div>
  );
}

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const handleLoginSuccess = (data, email) => {
    setDashboardData(data);
    setUserEmail(email);
  };

  // Si dashboardData existe, el usuario está autenticado
  const isAuthenticated = dashboardData !== null;

  return (
    <div id="app-root">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className="app-container" style={{ minHeight: '100vh', padding: '16px 20px', display: 'flex', flexDirection: 'column', maxWidth: '950px', margin: '0 auto' }}>
        {isAuthenticated ? (
          <Dashboard key="dashboard" data={dashboardData} userEmail={userEmail} />
        ) : (
          <LoginOTP key="login" onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}

export default App;
