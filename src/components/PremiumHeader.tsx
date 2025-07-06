import React from 'react';

export default function PremiumHeader() {
  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between py-8 px-4 md:px-12 mb-12 bg-white/80 backdrop-blur-xl border-b border-zinc-200 shadow-premium">
      <div className="flex items-center gap-4">
        <span className="w-12 h-12 rounded-full bg-gradient-to-br from-gold via-dark to-accent border-2 border-gold shadow-lg flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" stroke="#b5a642" strokeWidth="2" fill="#232323" />
            <path d="M16 8v8l6 3" stroke="#b5a642" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gold to-dark bg-clip-text text-transparent select-none font-display">Finance <span className="text-gold">Pro</span></span>
      </div>
      <div className="flex items-center gap-6 mt-4 md:mt-0">
        <span className="hidden md:inline text-zinc-500 font-medium text-lg font-display">Inspirado en Rolex · F1 · Apple</span>
        <button className="rounded-full bg-gradient-to-br from-gold to-dark text-white px-7 py-2 font-bold shadow-lg hover:scale-105 transition font-display text-lg">Premium</button>
      </div>
    </header>
  );
}
