import React from 'react';

const features = [
  {
    icon: '📊',
    title: 'Visualización avanzada',
    desc: 'Gráficos claros y modernos para entender tu presupuesto al instante.'
  },
  {
    icon: '🔒',
    title: 'Privacidad total',
    desc: 'Tus datos se almacenan de forma segura y nunca se comparten.'
  },
  {
    icon: '⚡',
    title: 'Rápido y responsivo',
    desc: 'Optimizado para cualquier dispositivo, siempre fluido.'
  },
  {
    icon: '🧑‍💼',
    title: 'Recomendaciones inteligentes',
    desc: 'Basadas en el costo de vida real y tus hábitos.'
  },
  {
    icon: '🌙',
    title: 'Modo oscuro premium',
    desc: 'Disfruta de una experiencia elegante de día y de noche.'
  },
  {
    icon: '🛡️',
    title: 'Inspiración de lujo',
    desc: 'Estética inspirada en Rolex, F1 y Apple.'
  },
];

export default function PremiumFeatures() {
  return (
    <section className="my-12">
      <h3 className="text-xl font-bold mb-6 text-[#b5a642] text-center tracking-wide">¿Por qué elegir Finance Pro?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map(f => (
          <div key={f.title} className="flex flex-col items-center bg-gradient-to-br from-[#232323]/80 via-[#1e2d24]/80 to-[#b5a642]/60 rounded-2xl p-6 shadow-xl">
            <span className="text-3xl mb-2 drop-shadow-lg">{f.icon}</span>
            <span className="font-bold text-[#b5a642] mb-1 text-lg">{f.title}</span>
            <span className="text-zinc-200 text-sm text-center">{f.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
