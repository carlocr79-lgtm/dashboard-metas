import { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import './styles/variables.css';
import './styles/components.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomeTab from './components/HomeTab';
import MetasTab from './components/MetasTab';
import CampaignTab from './components/CampaignTab';
import BoletasTab from './components/BoletasTab';
import LoginOTP from './components/LoginOTP';
import ErrorBoundary from './components/ErrorBoundary';
import { callGAS } from './services/api';

function Dashboard({ data, userEmail, setDashboardData, onLogout }) {
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
    <div className="app-layout" style={{ animation: 'fadeInScale 0.6s ease-out' }}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userData={data} 
      />
      
      <div className="main-content-area">
        <Header 
          userData={data} 
          isSyncing={isSyncing} 
          lastSync={lastSync} 
          onSync={handleManualSync}
          onLogout={onLogout}
        />

        <main>
          <ErrorBoundary>
            {activeTab === 'inicio' && <HomeTab data={data} />}
            {activeTab === 'metas' && <MetasTab data={data} />}
            {activeTab === 'campana' && <CampaignTab data={data} />}
            {activeTab === 'boletas' && <BoletasTab data={data} />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  // Auto-login al recargar (persistencia en sesión)
  useEffect(() => {
    const saved = sessionStorage.getItem('metas_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDashboardData(parsed.data);
        setUserEmail(parsed.email);
      } catch(e) {}
    }
  }, []);

  const handleLoginSuccess = (data, email) => {
    setDashboardData(data);
    setUserEmail(email);
    sessionStorage.setItem('metas_session', JSON.stringify({ data, email }));
  };

  const handleLogout = () => {
    setDashboardData(null);
    setUserEmail('');
    sessionStorage.removeItem('metas_session');
  };

  // Si dashboardData existe, el usuario está autenticado
  const isAuthenticated = dashboardData !== null;

  return (
    <div id="app-root">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
        {isAuthenticated ? (
          <Dashboard 
            key="dashboard" 
            data={dashboardData} 
            userEmail={userEmail} 
            setDashboardData={setDashboardData}
            onLogout={handleLogout}
          />
        ) : (
          <LoginOTP key="login" onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}

export default App;
