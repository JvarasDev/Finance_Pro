"use client";
import React, { useState } from 'react';
import DashboardTitle from '@/components/DashboardTitle';
import PremiumForm from '@/components/PremiumForm';
import { useAuth } from '@/contexts/AuthContext';

export default function ConfiguracionPage() {
  const { user, token, loading } = useAuth();
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [nombre, setNombre] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(''); // Si tienes campo real, cámbialo
  const [direccion, setDireccion] = useState(''); // Si tienes campo real, cámbialo
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (user) {
      setNombre(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: nombre, email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      setGuardado(true);
      setShowPersonalForm(false);
      setTimeout(() => setGuardado(false), 3000);
      // Opcional: recargar usuario en el contexto
      // window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (passwordNueva !== passwordConfirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: passwordActual, newPassword: passwordNueva })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar contraseña');
      setGuardado(true);
      setShowPasswordForm(false);
      setPasswordActual('');
      setPasswordNueva('');
      setPasswordConfirmar('');
      setTimeout(() => setGuardado(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="main-dashboard">Cargando...</div>;
  if (!user) return <div className="main-dashboard">No autenticado</div>;

  return (
    <div className="main-dashboard dashboard-premium-bg">
      <DashboardTitle title="Configuración" subtitle="Gestiona tu información personal y seguridad" className="premium-title" />
      
      {/* Información Personal */}
      <div className="dashboard-premium-card mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-gold to-yellow-400 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gold">Información Personal</h2>
              <p className="text-gray-300">Edita tu nombre, email y datos de contacto</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowPersonalForm(true)}
          >
            ✏️ Editar
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <label className="text-sm text-gray-400">Nombre completo</label>
            <p className="text-white font-semibold">{nombre}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <label className="text-sm text-gray-400">Email</label>
            <p className="text-white font-semibold">{email}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <label className="text-sm text-gray-400">Teléfono</label>
            <p className="text-white font-semibold">{telefono || <span className='text-gray-500'>No registrado</span>}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <label className="text-sm text-gray-400">Dirección</label>
            <p className="text-white font-semibold">{direccion || <span className='text-gray-500'>No registrada</span>}</p>
          </div>
        </div>
      </div>

      {/* Contraseña */}
      <div className="dashboard-premium-card mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
              🔐
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gold">Seguridad</h2>
              <p className="text-gray-300">Cambia tu contraseña para mantener tu cuenta segura</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowPasswordForm(true)}
          >
            🔑 Cambiar Contraseña
          </button>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-400">Estado de la contraseña</label>
              <p className="text-green-400 font-semibold">✓ Segura y actualizada</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Último cambio</p>
              <p className="text-white font-semibold">Hace 30 días</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de confirmación y error */}
      {guardado && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          ✅ Cambios guardados correctamente
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      {/* Formulario de Información Personal */}
      {showPersonalForm && (
        <div className="premium-modal-overlay">
          <div className="premium-modal">
            <button className="premium-modal-close" onClick={() => setShowPersonalForm(false)} title="Cerrar">×</button>
            <PremiumForm
              title="Editar Información Personal"
              icon="👤"
              onSubmit={handlePersonalSubmit}
              onCancel={() => setShowPersonalForm(false)}
              submitLabel="Guardar Cambios"
              fields={[
                {
                  name: 'nombre',
                  label: 'Nombre completo',
                  type: 'text',
                  value: nombre,
                  onChange: e => setNombre(e.target.value),
                  placeholder: 'Tu nombre completo',
                  required: true
                },
                {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  value: email,
                  onChange: e => setEmail(e.target.value),
                  placeholder: 'tu@email.com',
                  required: true
                }
              ]}
            />
          </div>
        </div>
      )}

      {/* Formulario de Contraseña */}
      {showPasswordForm && (
        <div className="premium-modal-overlay">
          <div className="premium-modal">
            <button className="premium-modal-close" onClick={() => setShowPasswordForm(false)} title="Cerrar">×</button>
            <PremiumForm
              title="Cambiar Contraseña"
              icon="🔐"
              onSubmit={handlePasswordSubmit}
              onCancel={() => setShowPasswordForm(false)}
              submitLabel="Actualizar Contraseña"
              fields={[
                {
                  name: 'passwordActual',
                  label: 'Contraseña actual',
                  type: 'password',
                  value: passwordActual,
                  onChange: e => setPasswordActual(e.target.value),
                  placeholder: 'Ingresa tu contraseña actual',
                  required: true
                },
                {
                  name: 'passwordNueva',
                  label: 'Nueva contraseña',
                  type: 'password',
                  value: passwordNueva,
                  onChange: e => setPasswordNueva(e.target.value),
                  placeholder: 'Ingresa tu nueva contraseña',
                  required: true
                },
                {
                  name: 'passwordConfirmar',
                  label: 'Confirmar nueva contraseña',
                  type: 'password',
                  value: passwordConfirmar,
                  onChange: e => setPasswordConfirmar(e.target.value),
                  placeholder: 'Confirma tu nueva contraseña',
                  required: true
                }
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
