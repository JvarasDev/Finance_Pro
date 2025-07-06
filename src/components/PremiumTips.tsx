import React from 'react';

const tips = [
  {
    icon: '💡',
    title: 'Ahorra primero',
    desc: 'Reserva al menos un 10% de tu ingreso mensual antes de gastar.'
  },
  {
    icon: '🛒',
    title: 'Compra inteligente',
    desc: 'Aprovecha ofertas y compara precios antes de comprar.'
  },
  {
    icon: '🚗',
    title: 'Transporte eficiente',
    desc: 'Prefiere transporte público o comparte viajes para reducir gastos.'
  },
  {
    icon: '🍽️',
    title: 'Cocina en casa',
    desc: 'Preparar tus comidas puede ahorrar hasta un 30% mensual.'
  },
  {
    icon: '📈',
    title: 'Revisa tus gastos',
    desc: 'Haz seguimiento mensual y ajusta tus hábitos según tus metas.'
  },
];

export default function PremiumTips() {
  return (
    <section className="my-12">
      <h3 className="text-xl font-bold mb-6 text-[#b5a642] text-center tracking-wide">Consejos de Ahorro Premium</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map(tip => (
          <div key={tip.title} className="flex flex-col items-center bg-gradient-to-br from-[#232323]/80 via-[#1e2d24]/80 to-[#b5a642]/60 rounded-2xl p-6 shadow-xl">
            <span className="text-3xl mb-2 drop-shadow-lg">{tip.icon}</span>
            <span className="font-bold text-[#b5a642] mb-1 text-lg">{tip.title}</span>
            <span className="text-zinc-200 text-sm text-center">{tip.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
