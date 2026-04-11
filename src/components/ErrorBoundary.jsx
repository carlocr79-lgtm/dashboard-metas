import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Component crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          maxWidth: '500px', margin: '60px auto', padding: '32px', textAlign: 'center',
          background: 'white', borderRadius: '20px', border: '1px solid #fecaca',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ color: '#dc2626', fontWeight: 800, marginBottom: '8px' }}>
            Algo salió mal
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
            Ocurrió un error inesperado al renderizar el panel. 
            Esto puede deberse a datos incompletos del servidor.
          </p>
          <pre style={{ 
            background: '#fef2f2', padding: '12px', borderRadius: '8px', 
            fontSize: '0.75rem', color: '#991b1b', textAlign: 'left', 
            overflow: 'auto', maxHeight: '120px', marginBottom: '16px'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              background: 'linear-gradient(135deg, #002d72, #1e40af)', color: 'white',
              border: 'none', padding: '12px 24px', borderRadius: '12px', 
              fontWeight: 700, cursor: 'pointer'
            }}
          >
            Recargar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
