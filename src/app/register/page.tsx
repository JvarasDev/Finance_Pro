'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const ok = await register(formData.name, formData.email, formData.password);
    if (ok) {
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTimeout(() => router.push('/login'), 1500);
    } else {
      setError('No se pudo registrar.');
    }
    setLoading(false);
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="w-full max-w-md mx-auto flex flex-col items-center pt-8 pb-2">
          <span className="login-logo">💰</span>
          <h1 className="login-title">Finance Pro</h1>
        </div>
        <div className="w-full max-w-md mx-auto text-center mb-8">
          <h2 className="login-title" style={{fontSize:'1.3rem', marginBottom:0}}>Crea tu cuenta</h2>
        </div>
        {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center font-semibold">{success}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-4">
            <label htmlFor="name" className="login-label">Nombre completo</label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="login-input"
              placeholder="Tu nombre completo"
              autoComplete="name"
            />
          </div>
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
                autoComplete="new-password"
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
              <span>Crear Cuenta</span>
            )}
          </button>
        </form>
        <div className="w-full max-w-md mx-auto text-center mt-6">
          <p className="text-md text-gray-700 font-semibold">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => router.push('/login')}
              className="login-link"
              style={{background:'none',border:'none',padding:0}}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
      <div className="login-right">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="Fondo registro"
        />
      </div>
    </div>
  );
} 