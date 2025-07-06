'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTitle from '@/components/DashboardTitle';
import GlassPanel from '@/components/GlassPanel';

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  foodExpenses: number;
  transportExpenses: number;
  housingExpenses: number;
  investmentExpenses: number;
  entertainmentExpenses: number;
}

const CATEGORIES = [
  { key: 'ALIMENTACION', label: 'Comida', emoji: '🍽️', percent: 15 },
  { key: 'TRANSPORTE', label: 'Transporte', emoji: '🚗', percent: 10 },
  { key: 'VIVIENDA', label: 'Vivienda', emoji: '🏠', percent: 30 },
  { key: 'INVERSIONES', label: 'Inversiones', emoji: '📈', percent: 10 },
  { key: 'ENTRETENIMIENTO', label: 'Entretenimiento', emoji: '🎉', percent: 5 },
];
const SAVINGS_PERCENT = 20;

export default function DashboardHome() {
  const { user, token } = useAuth();
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchFinancialData();
    }
  }, [token]);

  const fetchFinancialData = async () => {
    try {
      const [incomesResponse, expensesResponse] = await Promise.all([
        fetch('/api/incomes', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/expenses', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (incomesResponse.ok && expensesResponse.ok) {
        const incomes = await incomesResponse.json();
        const expenses = await expensesResponse.json();

        const totalIncome = incomes.reduce((sum: number, income: any) => sum + income.amount, 0);
        const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
        const savings = totalIncome - totalExpenses;

        // Categorizar gastos
        const foodExpenses = expenses
          .filter((expense: any) => expense.category === 'ALIMENTACION')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);
        
        const transportExpenses = expenses
          .filter((expense: any) => expense.category === 'TRANSPORTE')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);
        
        const housingExpenses = expenses
          .filter((expense: any) => expense.category === 'VIVIENDA')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);
        
        const investmentExpenses = expenses
          .filter((expense: any) => expense.category === 'INVERSIONES')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);
        
        const entertainmentExpenses = expenses
          .filter((expense: any) => expense.category === 'ENTRETENIMIENTO')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);

        setFinancialData({
          totalIncome,
          totalExpenses,
          savings,
          foodExpenses,
          transportExpenses,
          housingExpenses,
          investmentExpenses,
          entertainmentExpenses
        });
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getFinancialStatus = () => {
    if (!financialData) return 'Sin datos';
    const savingsRate = (financialData.savings / financialData.totalIncome) * 100;
    if (savingsRate >= 20) return 'Excelente';
    if (savingsRate >= 10) return 'Bueno';
    if (savingsRate >= 0) return 'Regular';
    return 'Requiere atención';
  };

  const savingsRecommended = financialData ? financialData.totalIncome * SAVINGS_PERCENT / 100 : 0;
  const savingsReal = financialData ? financialData.savings : 0;

  const getCategorySpent = (cat: string) => {
    if (!financialData) return 0;
    switch (cat) {
      case 'ALIMENTACION': return financialData.foodExpenses;
      case 'TRANSPORTE': return financialData.transportExpenses;
      case 'VIVIENDA': return financialData.housingExpenses;
      case 'INVERSIONES': return financialData.investmentExpenses;
      case 'ENTRETENIMIENTO': return financialData.entertainmentExpenses;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="main-dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos financieros...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!financialData || (financialData.totalIncome === 0 && financialData.totalExpenses === 0)) {
    return (
      <div className="main-dashboard dashboard-premium-bg" style={{position:'relative', minHeight:'100vh', overflow:'hidden'}}>
        {/* Fondo decorativo premium */}
        <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:0, pointerEvents:'none'}}>
          <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0}}>
            <ellipse cx="720" cy="-100" rx="900" ry="300" fill="#fbbf24" fillOpacity="0.07"/>
            <ellipse cx="200" cy="600" rx="400" ry="120" fill="#fbbf24" fillOpacity="0.10"/>
            <ellipse cx="1240" cy="500" rx="300" ry="100" fill="#fbbf24" fillOpacity="0.08"/>
          </svg>
        </div>
        <DashboardTitle 
          title={<span style={{color:'#fbbf24',fontWeight:800,letterSpacing:'-1px'}}>¡Hola {user?.name}!</span>} 
          subtitle={<span style={{color:'#e2e8f0'}}>Comienza agregando tus datos financieros para ver tu dashboard personalizado</span>} 
        />
        {/* Panel central premium */}
        <div style={{maxWidth:700,margin:'0 auto',zIndex:2,position:'relative'}}>
          <div className="glass-panel premium text-center" style={{boxShadow:'0 8px 32px 0 #fbbf2420',border:'2px solid #fbbf24',borderRadius:'2rem',padding:'2.5rem 2rem',marginBottom:'2.5rem',backdropFilter:'blur(16px)'}}>
            <div className="animate-fade-in" style={{fontSize:'4rem',marginBottom:'1.5rem',animation:'float 2.5s ease-in-out infinite alternate'}}>
              <span role="img" aria-label="premium">📈</span>
            </div>
            <h2 className="text-3xl font-extrabold mb-4" style={{color:'#fbbf24',letterSpacing:'-1px'}}>¡Tu dashboard está vacío!</h2>
            <p className="text-lg text-gray-200 mb-8" style={{maxWidth:500,margin:'0 auto'}}>Para comenzar a usar <b>Finance Pro</b>, necesitas agregar tus ingresos y gastos.<br/>Esto nos permitirá darte <span style={{color:'#fbbf24'}}>recomendaciones personalizadas</span> basadas en tu situación financiera.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/dashboard/ingresos" className="btn btn-primary" style={{fontSize:'1.1rem',padding:'1rem 2.5rem',borderRadius:'1.5rem',boxShadow:'0 4px 16px 0 #fbbf2440'}}>💰 Agregar Ingresos</a>
              <a href="/dashboard/analisis" className="btn btn-secondary" style={{fontSize:'1.1rem',padding:'1rem 2.5rem',borderRadius:'1.5rem',boxShadow:'0 4px 16px 0 #fff2'}}>📈 Ver Análisis</a>
            </div>
          </div>
          {/* Cards premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 animate-fade-in" style={{zIndex:2}}>
            <div className="glass-panel premium text-center" style={{border:'1.5px solid #fbbf24',borderRadius:'1.5rem',padding:'2rem 1.5rem',boxShadow:'0 2px 12px 0 #fbbf2410'}}>
              <div style={{fontSize:'2.2rem',marginBottom:'0.5rem'}}>🔥</div>
              <h3 className="text-lg font-bold mb-1" style={{color:'#fbbf24'}}>Ingresos</h3>
              <p className="text-gray-200">Registra tus fuentes de ingresos mensuales</p>
            </div>
            <div className="glass-panel premium text-center" style={{border:'1.5px solid #fbbf24',borderRadius:'1.5rem',padding:'2rem 1.5rem',boxShadow:'0 2px 12px 0 #fbbf2410'}}>
              <div style={{fontSize:'2.2rem',marginBottom:'0.5rem'}}>💸</div>
              <h3 className="text-lg font-bold mb-1" style={{color:'#fbbf24'}}>Gastos</h3>
              <p className="text-gray-200">Lleva el control de todos tus gastos</p>
            </div>
            <div className="glass-panel premium text-center" style={{border:'1.5px solid #fbbf24',borderRadius:'1.5rem',padding:'2rem 1.5rem',boxShadow:'0 2px 12px 0 #fbbf2410'}}>
              <div style={{fontSize:'2.2rem',marginBottom:'0.5rem'}}>🎯</div>
              <h3 className="text-lg font-bold mb-1" style={{color:'#fbbf24'}}>Metas</h3>
              <p className="text-gray-200">Define y alcanza tus objetivos financieros</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-dashboard dashboard-premium-bg">
      <DashboardTitle 
        title={`¡Hola ${user?.name}!`} 
        subtitle="Aquí tienes un resumen de tu situación financiera" 
        className="premium-title"
      />
      <div className="dashboard-premium-grid mb-8">
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">💰</div>
          <div className="dashboard-premium-label">INGRESOS TOTALES</div>
          <div className="dashboard-premium-value">{formatCurrency(financialData.totalIncome)}</div>
          <div className="dashboard-premium-desc">Ingresos registrados</div>
        </div>
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">💸</div>
          <div className="dashboard-premium-label">GASTOS TOTALES</div>
          <div className="dashboard-premium-value">{formatCurrency(financialData.totalExpenses)}</div>
          <div className="dashboard-premium-desc">Gastos registrados</div>
        </div>
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">✅</div>
          <div className="dashboard-premium-label">ESTADO FINANCIERO</div>
          <div className="dashboard-premium-value {getFinancialStatus() === 'Excelente' ? 'text-gold' : ''}">{getFinancialStatus()}</div>
          <div className="dashboard-premium-desc">Basado en tu ahorro</div>
        </div>
      </div>
      <div className="dashboard-premium-categories-grid">
        <div className="dashboard-premium-category-card">
          <div className="dashboard-premium-category-icon">💰</div>
          <div className="dashboard-premium-category-label">AHORRO</div>
          <div className="dashboard-premium-category-value">{formatCurrency(financialData.savings)}</div>
        </div>
        {CATEGORIES.map(cat => {
          const recommended = financialData.totalIncome * cat.percent / 100;
          const spent = getCategorySpent(cat.key);
          return (
            <div className="dashboard-premium-category-card" key={cat.key}>
              <div className="dashboard-premium-category-icon">{cat.emoji}</div>
              <div className="dashboard-premium-category-label">{cat.label.toUpperCase()}</div>
              <div className="dashboard-premium-category-value {spent > recommended ? 'text-red-600' : ''}">{formatCurrency(spent)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
