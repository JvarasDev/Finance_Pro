import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium';
}

export default function GlassPanel({ children, className = '', variant = 'default' }: GlassPanelProps) {
  return (
    <div className={`glass-panel ${variant === 'premium' ? 'premium' : ''} ${className}`}>
      {children}
    </div>
  );
}
