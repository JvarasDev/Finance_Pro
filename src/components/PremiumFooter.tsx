import React from 'react';

export default function PremiumFooter() {
  return (
    <footer className="w-full mt-20 py-10 px-4 flex flex-col md:flex-row items-center justify-between bg-white/80 dark:bg-dark/80 border-t border-zinc-200 dark:border-zinc-800 shadow-premium rounded-t-2xl">
      <div className="flex items-center gap-2 text-zinc-500 text-base font-display">
        <span className="font-bold text-gold">Finance Pro</span> © {new Date().getFullYear()} — Inspirado en Apple, Rolex y F1
      </div>
      <div className="flex gap-6 mt-4 md:mt-0">
        <a href="#" className="text-gold hover:underline font-semibold font-display">Política de Privacidad</a>
        <a href="#" className="text-gold hover:underline font-semibold font-display">Contacto</a>
        <a href="#" className="text-gold hover:underline font-semibold font-display">LinkedIn</a>
      </div>
    </footer>
  );
}
