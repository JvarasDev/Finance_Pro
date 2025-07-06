import React from 'react';

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 transition-all ${className}`}>
      {children}
    </div>
  );
}
