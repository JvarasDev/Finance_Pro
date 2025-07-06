import React from 'react';

interface DashboardTitleProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  className?: string;
}

export default function DashboardTitle({ title, subtitle, className }: DashboardTitleProps) {
  return (
    <div className={`dashboard-title${className ? ' ' + className : ''}`}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
