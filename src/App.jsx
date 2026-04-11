import { useState } from 'react';
import './styles/variables.css';
import './styles/components.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {/* Background Shapes Corporativos */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className="app-container" style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        {!isAuthenticated ? (
          <div className="glass-card" style={{ margin: 'auto', maxWidth: '400px', textAlign: 'center', width: '100%' }}>
             <h2 style={{ color: 'var(--primary-bank)', fontWeight: 800 }}>Grupo Efectivo</h2>
             <p style={{ color: 'var(--text-muted)' }}>Dashboard METAS - React Migration</p>
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
               Simular Entrada OTP
             </button>
          </div>
        ) : (
          <div>
            <header className="glass-header">
              <div>
                <h3 style={{ margin: 0, color: 'var(--primary-bank)' }}>Dashboard Premium</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Módulo React Activo</span>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-bank)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                W
              </div>
            </header>

            <main className="glass-card">
              <h4 style={{ color: 'var(--accent-bank)', borderBottom: '2px solid var(--glass-border)', paddingBottom: '10px' }}>
                Estatus de Migración
              </h4>
              <p style={{ color: 'var(--text-main)' }}>
                Se ha configurado la arquitecura base (Vite + React) exitosamente.
              </p>
              <ul>
                <li><strong>Variables CSS:</strong> Extraídas ✔️</li>
                <li><strong>Componentes Glassmorphism:</strong> Estructurados ✔️</li>
                <li><strong>API Bridge:</strong> Conectado a GAS vía Promesas ✔️</li>
              </ul>
              <button 
                onClick={() => setIsAuthenticated(false)}
                style={{
                  background: 'var(--bg-body)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--glass-border)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  marginTop: '16px'
                }}
              >
                Cerrar Sesión
              </button>
            </main>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
