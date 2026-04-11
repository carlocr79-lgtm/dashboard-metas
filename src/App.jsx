import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import './styles/variables.css';
import './styles/components.css';

import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import SkeletonLoader from './components/SkeletonLoader';
import HomeTab from './components/HomeTab';
import CampaignTab from './components/CampaignTab';
import GeneralTab from './components/GeneralTab';
import BoletasTab from './components/BoletasTab';
import LoginOTP from './components/LoginOTP';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Real Dashboard Data coming from GAS
  const [dashboardData, setDashboardData] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const handleLoginSuccess = (data, email) => {
    setDashboardData(data);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleSimularSincronizacion = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <ErrorBoundary>
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className="app-container" style={{ minHeight: '100vh', padding: '16px 20px', display: 'flex', flexDirection: 'column', maxWidth: '950px', margin: '0 auto' }}>
        {!isAuthenticated ? (
          <LoginOTP onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div style={{ width: '100%', animation: 'fadeInScale 0.6s ease-out' }}>
            
            <Header 
              userData={dashboardData} 
              isSyncing={isSyncing} 
              lastSync={new Date().toLocaleTimeString('es-PE', {hour: '2-digit', minute:'2-digit'})} 
            />
            
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            <main>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={handleSimularSincronizacion} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                   <RefreshCw size={14} style={{marginRight: '6px'}} /> Refrescar Panel
                </button>
              </div>

              {activeTab === 'inicio' && <HomeTab data={dashboardData} />}
              {activeTab === 'general' && <GeneralTab data={dashboardData} />}
              {activeTab === 'campana' && <CampaignTab data={dashboardData} />}
              {activeTab === 'bonos' && <BoletasTab data={dashboardData} />}
            </main>
            
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
