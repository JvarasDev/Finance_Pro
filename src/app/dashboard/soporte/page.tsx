"use client";
import GlassPanel from '@/components/GlassPanel';
import React, { useState } from 'react';
import DashboardTitle from '@/components/DashboardTitle';
import PremiumForm from '@/components/PremiumForm';

export default function SoportePage() {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setNombre('');
    setCorreo('');
    setMensaje('');
    setShowForm(false);
  };

  const faqs = [
    {
      pregunta: '¿Cómo puedo cambiar mi meta de ahorro mensual?',
      respuesta: 'Ve a Configuración > Preferencias > Meta de Ahorro Mensual y ajusta el valor según tus objetivos financieros.',
      categoria: 'Configuración'
    },
    {
      pregunta: '¿Puedo exportar mis datos financieros?',
      respuesta: 'Sí, en Configuración > Privacidad y Seguridad > Exportar Datos puedes descargar toda tu información en formato CSV.',
      categoria: 'Datos'
    },
    {
      pregunta: '¿Cómo funciona el análisis de gastos automático?',
      respuesta: 'Nuestro sistema categoriza automáticamente tus transacciones usando IA. Puedes ajustar las categorías manualmente si es necesario.',
      categoria: 'Análisis'
    },
    {
      pregunta: '¿Qué incluye el plan Premium?',
      respuesta: 'Análisis avanzados, recomendaciones personalizadas, cursos de educación financiera, herramientas premium y soporte prioritario.',
      categoria: 'Planes'
    },
    {
      pregunta: '¿Cómo puedo cancelar mi suscripción?',
      respuesta: 'Ve a Configuración > Información de la Cuenta > Cambiar Plan y selecciona "Cancelar Suscripción".',
      categoria: 'Facturación'
    },
    {
      pregunta: '¿Mis datos están seguros?',
      respuesta: 'Absolutamente. Usamos encriptación de nivel bancario y cumplimos con todas las regulaciones de protección de datos.',
      categoria: 'Seguridad'
    }
  ];

  const categoriasSoporte = [
    {
      nombre: 'Configuración',
      descripcion: 'Ayuda con ajustes de cuenta y preferencias',
      icono: '⚙️',
      color: '#3b82f6'
    },
    {
      nombre: 'Facturación',
      descripcion: 'Preguntas sobre pagos y suscripciones',
      icono: '💳',
      color: '#10b981'
    },
    {
      nombre: 'Funcionalidades',
      descripcion: 'Cómo usar las herramientas de la app',
      icono: '🛠️',
      color: '#f59e0b'
    },
    {
      nombre: 'Problemas Técnicos',
      descripcion: 'Errores y problemas de la aplicación',
      icono: '🔧',
      color: '#ef4444'
    }
  ];

  const metodosContacto = [
    {
      nombre: 'Chat en Vivo',
      descripcion: 'Respuesta inmediata de nuestro equipo',
      tiempo: '24/7',
      icono: '💬',
      color: '#10b981'
    },
    {
      nombre: 'Email',
      descripcion: 'soporte@financepro.cl',
      tiempo: '24 horas',
      icono: '📧',
      color: '#3b82f6'
    },
    {
      nombre: 'WhatsApp',
      descripcion: '+56 9 1234 5678',
      tiempo: '8:00 - 20:00',
      icono: '📱',
      color: '#25d366'
    },
    {
      nombre: 'Centro de Ayuda',
      descripcion: 'Base de conocimientos completa',
      tiempo: 'Siempre disponible',
      icono: '📚',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="main-dashboard dashboard-premium-bg">
      <DashboardTitle title="Soporte y Ayuda" subtitle="¿Tienes un problema? Contáctanos y te ayudamos rápido" className="premium-title" />
      <div className="dashboard-premium-card mb-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4 text-gold">📞 Contáctanos</h2>
        <p className="text-gray-300 mb-6">¿Tienes algún problema o consulta? Haz clic en el botón y cuéntanos tu situación. Te responderemos lo antes posible.</p>
        <button className="btn btn-primary mb-2" onClick={() => setShowForm(true)}>
          ✉️ Enviar un problema
        </button>
        {enviado && <div className="mt-4 text-green-500 font-semibold">¡Tu mensaje fue enviado correctamente!</div>}
      </div>
      {showForm && (
        <div className="premium-modal-overlay">
          <div className="premium-modal">
            <button className="premium-modal-close" onClick={() => setShowForm(false)} title="Cerrar">×</button>
            <PremiumForm
              title="Enviar un problema o consulta"
              icon="✉️"
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              submitLabel="Enviar"
              fields={[
                {
                  name: 'nombre',
                  label: 'Nombre',
                  type: 'text',
                  value: nombre,
                  onChange: e => setNombre(e.target.value),
                  placeholder: 'Tu nombre',
                  required: true
                },
                {
                  name: 'correo',
                  label: 'Correo electrónico',
                  type: 'text',
                  value: correo,
                  onChange: e => setCorreo(e.target.value),
                  placeholder: 'tu@email.com',
                  required: true
                },
                {
                  name: 'mensaje',
                  label: 'Mensaje',
                  type: 'text',
                  value: mensaje,
                  onChange: e => setMensaje(e.target.value),
                  placeholder: 'Describe tu problema o consulta',
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
