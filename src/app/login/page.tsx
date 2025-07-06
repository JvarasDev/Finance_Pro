'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const success = await login(formData.email, formData.password);
    if (!success) setError('Credenciales incorrectas');
    else router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="login-root">
      {/* Panel izquierdo: login */}
      <div className="login-left">
        <div className="w-full max-w-md mx-auto flex flex-col items-center pt-8 pb-2">
          <span className="login-logo">💰</span>
          <h1 className="login-title">Finance Pro</h1>
        </div>
        <div className="w-full max-w-md mx-auto text-center mb-8">
          <h2 className="login-title" style={{fontSize:'1.3rem', marginBottom:0}}>Bienvenido a la Plataforma</h2>
        </div>
        {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center font-semibold">{success}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-4">
            <label htmlFor="email" className="login-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="login-input"
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="login-label">Contraseña</label>
            <div style={{position:'relative'}}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="login-input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#002D72] text-lg"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{background:'none', border:'none', padding:0, cursor:'pointer'}}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? (
              <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Procesando...
              </span>
            ) : (
              <span>Ingresar</span>
            )}
          </button>
          {/* Recuperar clave */}
          <div style={{textAlign:'right',marginTop:'0.5rem'}}>
            <button type="button" className="login-link text-sm font-semibold" style={{background:'none',border:'none',padding:0}}>¿Problemas con tu clave? <span className="underline">Recupérala</span></button>
          </div>
        </form>
        {/* Enlaces adicionales */}
        <div className="w-full max-w-md mx-auto text-center mt-6">
          <p className="text-md text-gray-700 font-semibold">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => router.push('/register')}
              className="login-link"
              style={{background:'none',border:'none',padding:0}}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
        {/* Bloque de ayuda/contacto */}
        <div className="w-full max-w-md mx-auto mt-8 mb-8">
          <div className="login-help-panel">
            <p>¿Tienes problema para acceder a tu cuenta?</p>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:'2rem',flexWrap:'wrap',marginBottom:'0.5rem'}}>
              <div>
                <div className="login-help-title">Soporte Finance Pro</div>
                <div className="login-help-phone"><span>📞</span> 600 123 4567</div>
              </div>
              <div style={{borderLeft:'1.5px solid #e2e8f0',height:'2rem',display:'inline-block'}}></div>
              <div>
                <div className="login-help-title">Ayuda Premium</div>
                <div className="login-help-phone"><span>📞</span> 600 987 6543</div>
              </div>
            </div>
            <div style={{marginTop:'0.5rem'}}>
              <a href="/dashboard/soporte" className="login-link">IR AL CENTRO DE AYUDA</a>
            </div>
          </div>
        </div>
      </div>
      {/* Panel derecho: imagen de fondo */}
      <div className="login-right">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="Fondo login"
        />
      </div>
    </div>
  );
} 