import { useState, useEffect } from 'react';
import { ChartLine, AlertCircle, Mail, Send, CheckCircle, Unlock, ArrowLeft, ShieldAlert } from 'lucide-react';
import { callGAS } from '../services/api';

export default function LoginOTP({ onLoginSuccess }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Efecto del Temporizador para OTP
  useEffect(() => {
    let timerId;
    if (step === 2 && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // PASO 1: Enviar Email / Acceso Inteligente
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Intentar acceso directo (Dev mode del GAS backend)
      const dataSinOTP = await callGAS('accederSinOTP', [email.toLowerCase().trim()]);
      
      if (!dataSinOTP.accessDenied && !dataSinOTP.error && dataSinOTP.nombre) {
        // Exito, saltar OTP
        onLoginSuccess(dataSinOTP, email);
        return;
      }

      // Si rechaza el modo directo y pide validación, iniciamos flujo OTP normal
      if (dataSinOTP.accessDenied && ((dataSinOTP.error && (dataSinOTP.error.includes('desarrollo') || dataSinOTP.error.includes('Verificación'))) || (dataSinOTP.mensaje && dataSinOTP.mensaje.includes('directo')))) {
        await requestOTP();
        return;
      }

      // Error duro (No existe, denegado real)
      if (dataSinOTP.accessDenied || dataSinOTP.error) {
        setError(dataSinOTP.mensaje || dataSinOTP.error || 'Acceso no autorizado.');
      }
    } catch (err) {
      // Fallback a mandar código normal si accederSinOTP falla
      await requestOTP();
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async () => {
    try {
      const data = await callGAS('validarYEnviarCodigo', [email.toLowerCase().trim()]);
      if (data.accessDenied) {
        setError(data.mensaje || 'Acceso denegado.');
      } else {
        setStep(2);
        setTimeLeft(300); // reset 5 mins
        setError(null);
      }
    } catch (err) {
      setError('Error de red al conectar con Google Apps Script.');
    }
  };

  // PASO 2: Verificar OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;

    setLoading(true);
    setError(null);

    try {
      const data = await callGAS('validarCodigo', [email.toLowerCase().trim(), otp]);
      
      if (data.accessDenied) {
        setError(data.mensaje || 'Error de validación OTP.');
      } else if (data.nombre) {
        // ÉXITO REAL
        onLoginSuccess(data, email);
      } else {
        setError('Código inválido o expirado.');
      }
    } catch (err) {
      setError('Error al verificar código. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Render UI
  return (
    <div className="glass-card" style={{ maxWidth: '450px', width: '100%', margin: '40px auto', padding: '36px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
         <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-bank), #1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(0, 45, 114, 0.2)' }}>
            <ChartLine size={30} color="white" />
         </div>
         <h2 style={{ fontWeight: 900, color: 'var(--primary-bank)', margin: 0 }}>Dashboard de Metas</h2>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.3s ease-out' }}>
          <AlertCircle size={18} color="#ef4444" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleLogin} style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', textAlign: 'center' }}>
            Ingresa tu correo para acceder al sistema
          </p>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <input 
              type="email" 
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ width: '100%', padding: '14px 16px 14px 46px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', fontWeight: 500, color: '#1e293b', background: '#f8fafc', outline: 'none', transition: 'all 0.3s' }}
            />
            <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', border: 'none', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary-bank), #1e40af)', color: 'white', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0, 45, 114, 0.25)', transition: 'all 0.3s', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <div className="spin-anim" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div> : <Send size={18} />}
            {loading ? 'VERIFICANDO...' : 'ACCEDER'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle size={16} color="#3b82f6" />
            Código enviado a <span style={{ fontWeight: 800 }}>{email}</span>
          </div>

          <input 
            type="text" 
            placeholder="● ● ● ● ● ●" 
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            required
            disabled={loading}
            style={{ width: '100%', padding: '16px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', letterSpacing: '12px', color: '#002d72', background: '#f8fafc', outline: 'none', fontFamily: 'monospace', marginBottom: '12px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.8rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>⏱️ {formatTime(timeLeft)}</span>
            <button 
              type="button" 
              disabled={timeLeft > 0 || loading}
              onClick={requestOTP}
              style={{ color: timeLeft > 0 ? '#94a3b8' : '#2563eb', background: 'none', border: 'none', cursor: timeLeft > 0 ? 'not-allowed' : 'pointer', fontWeight: 700, textDecoration: timeLeft > 0 ? 'none' : 'underline' }}
            >
              Reenviar código
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading || otp.length < 6}
            style={{ width: '100%', padding: '14px', border: 'none', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary-bank), #1e40af)', color: 'white', fontSize: '1rem', fontWeight: 700, cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0, 45, 114, 0.25)', opacity: (loading || otp.length < 6) ? 0.7 : 1 }}
          >
             {loading ? <div className="spin-anim" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div> : <Unlock size={18} />}
             VERIFICAR CÓDIGO
          </button>

          <button 
             type="button" 
             onClick={() => setStep(1)}
             style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', margin: '16px auto 0' }}
          >
            <ArrowLeft size={14} /> Cambiar correo
          </button>
        </form>
      )}

      <div style={{ marginTop: '28px', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <ShieldAlert size={12} /> Grupo Efectivo &bull; Acceso exclusivo
      </div>
    </div>
  );
}
