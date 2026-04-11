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
  const syncIntervalRef = useRef(null);

  // ═══ AUTO-SYNC cada 15 segundos ═══
  const autoSync = useCallback(async () => {
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
      console.error('[AutoSync] Error:', err);
    }
    setIsSyncing(false);
  }, [userEmail, setDashboardData]);

  useEffect(() => {
    // Iniciar auto-sync cada 15 segundos
    syncIntervalRef.current = setInterval(autoSync, 15000);
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [autoSync]);

  const handleRefresh = () => {
    autoSync();
  };

  return (
    <div style={{ width: '100%', animation: 'fadeInScale 0.6s ease-out' }}>
      <Header 
        userData={data} 
        isSyncing={isSyncing} 
        lastSync={lastSync} 
      />
      
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button onClick={handleRefresh} disabled={isSyncing} style={{ 
            background: isSyncing ? '#dbeafe' : '#f1f5f9', 
            border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', 
            cursor: isSyncing ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 600, 
            display: 'flex', alignItems: 'center', gap: '6px',
            opacity: isSyncing ? 0.7 : 1,
            transition: 'all 0.3s ease'
          }}>
             <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} /> 
             {isSyncing ? 'Sincronizando...' : 'Refrescar Panel'}
          </button>
        </div>

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
