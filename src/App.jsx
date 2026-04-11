import { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import './styles/variables.css';
import './styles/components.css';

import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import HomeTab from './components/HomeTab';
import MetasTab from './components/MetasTab';
import CampaignTab from './components/CampaignTab';
import BonosTab from './components/BonosTab';
import BoletasTab from './components/BoletasTab';
import LoginOTP from './components/LoginOTP';
import ErrorBoundary from './components/ErrorBoundary';
import { callGAS } from './services/api';

function Dashboard({ data, userEmail, setDashboardData }) {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(
    new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
  );
  // ═══ SINCRONIZACIÓN MANUAL ═══
  const handleManualSync = useCallback(async () => {
    if (!userEmail) return;
    setIsSyncing(true);
    try {
      const freshData = await callGAS('obtenerMisDatosConEmail', [userEmail]);
      if (freshData && !freshData.error && !freshData.accessDenied) {
        setDashboardData(freshData);
        setLastSync(
          new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
        );
      }
    } catch (err) {
      console.error('[Sync] Error:', err);
    }
    setIsSyncing(false);
  }, [userEmail, setDashboardData]);

  return (
    <div style={{ width: '100%', animation: 'fadeInScale 0.6s ease-out' }}>
      <Header 
        userData={data} 
        isSyncing={isSyncing} 
        lastSync={lastSync} 
        onSync={handleManualSync}
      />
      
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        <ErrorBoundary>
          {activeTab === 'inicio' && <HomeTab data={data} />}
          {activeTab === 'metas' && <MetasTab data={data} />}
          {activeTab === 'campana' && <CampaignTab data={data} />}
          {activeTab === 'bonos' && <BonosTab data={data} />}
          {activeTab === 'boletas' && <BoletasTab data={data} />}
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
          <Dashboard 
            key="dashboard" 
            data={dashboardData} 
            userEmail={userEmail} 
            setDashboardData={setDashboardData}
          />
        ) : (
          <LoginOTP key="login" onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}

export default App;
