import { useState } from 'react';
import './styles/variables.css';
import './styles/components.css';

import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import SkeletonLoader from './components/SkeletonLoader';
import HomeTab from './components/HomeTab';
import CampaignTab from './components/CampaignTab';
import GeneralTab from './components/GeneralTab';
import BoletasTab from './components/BoletasTab';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [isSyncing, setIsSyncing] = useState(false);

  // Datos simulados (Mock) para previsualización inmediata de los componentes
  const dummyDataFull = {
    nombre: "Carlos Jony Lopez Garcia",
    codigo: "CARLOS L.",
    categoria: "EJECUTIVO",
    oficina: "SAN ISIDRO",
    m1: "2.10%",
    m0: "2.50%",
    o1: "45",
    o2: "32",
    col2: "S/. 125,400",
    col3: "82%",
    bonos: {
      estadoMora: "Comisiona - Saludable",
      bonoMensualTotal: "S/. 1,450.00",
      bonoTrimestralTotal: "S/. 2,100.00"
    },
    campanias: [
      {
        name: "Campaña Fiestas Patrias",
        activa: true,
        miPuesto: 2,
        moraMax: "3.5",
        topGanadores: 5,
        ranking: [
           { nombre: "MARIA FERNANDA O.", oficina: "CHIMBOTE", ops: "48", colocacionTexto: "S/. 142k" },
           { nombre: "CARLOS JONY LOPEZ GARCIA", oficina: "SAN ISIDRO", ops: "45", colocacionTexto: "S/. 125k" },
           { nombre: "JOSE PEREZ", oficina: "TRUJILLO", ops: "40", colocacionTexto: "S/. 110k" },
           { nombre: "ANA RUIZ", oficina: "LIMA", ops: "35", colocacionTexto: "S/. 90k" }
        ]
      }
    ]
  };

  const handleSimularSincronizacion = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <>
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className="app-container" style={{ minHeight: '100vh', padding: '16px 20px', display: 'flex', flexDirection: 'column', maxWidth: '950px', margin: '0 auto' }}>
        {!isAuthenticated ? (
          <div className="glass-card" style={{ margin: 'auto', maxWidth: '400px', textAlign: 'center', width: '100%' }}>
             <h2 style={{ color: 'var(--primary-bank)', fontWeight: 800 }}>Grupo Efectivo</h2>
             <p style={{ color: 'var(--text-muted)' }}>Dashboard METAS</p>
             <button 
                onClick={() => setIsAuthenticated(true)}
                style={{
                  background: 'var(--grad-cobalt)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '16px'
                }}
             >
               Acceder (Mock)
             </button>
          </div>
        ) : (
          <div style={{ width: '100%', animation: 'fadeInScale 0.6s ease-out' }}>
            
            <Header 
              userData={dummyDataFull} 
              isSyncing={isSyncing} 
              lastSync={new Date().toLocaleTimeString('es-PE', {hour: '2-digit', minute:'2-digit'})} 
            />
            
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Area de contenido dinámico */}
            <main>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={handleSimularSincronizacion} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                   Probar Sincronización
                </button>
              </div>

              {activeTab === 'inicio' && <HomeTab data={dummyDataFull} />}
              {activeTab === 'general' && <GeneralTab data={dummyDataFull} />}
              {activeTab === 'campana' && <CampaignTab data={dummyDataFull} />}
              {activeTab === 'bonos' && <BoletasTab data={dummyDataFull} />}
            </main>
            
          </div>
        )}
      </div>
    </>
  );
}

export default App;
