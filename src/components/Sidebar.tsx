"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/ingresos', label: 'Ingresos', icon: '💰' },
    { href: '/dashboard/analisis', label: 'Análisis', icon: '📈' },
    { href: '/dashboard/recomendaciones', label: 'Recomendaciones', icon: '💡' },
    { href: '/dashboard/configuracion', label: 'Configuración', icon: '⚙️' },
    { href: '/dashboard/soporte', label: 'Soporte', icon: '🆘' },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para móviles */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[1999]"
          onClick={onClose}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">Finance Pro</h1>
          <p className="sidebar-subtitle">Tu asesor financiero premium</p>
        </div>
        
        {user && (
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
              <span className={`user-plan ${user.plan.toLowerCase()}`}>
                {user.plan === 'PREMIUM' ? '🚀 Premium' : '📱 Gratis'}
              </span>
            </div>
          </div>
        )}
        
        <nav>
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.href} className="nav-item">
                <Link 
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="glass-panel premium">
          <h3 className="text-center mb-4">
            {user?.plan === 'PREMIUM' ? '🚀 Plan Premium' : '📱 Plan Gratis'}
          </h3>
          <p className="text-center mb-4">
            {user?.plan === 'PREMIUM' 
              ? 'Disfruta de análisis avanzados y recomendaciones personalizadas'
              : 'Actualiza para acceder a análisis avanzados y recomendaciones personalizadas'
            }
          </p>
          {user?.plan === 'FREE' && (
            <button className="btn btn-primary w-full">Actualizar Plan</button>
          )}
        </div>

        <div className="sidebar-footer">
          <button 
            onClick={handleLogout}
            className="btn btn-secondary w-full"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
