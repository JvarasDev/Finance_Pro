'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTitle from '@/components/DashboardTitle';

const CATEGORIES = [
  { key: 'ALIMENTACION', label: 'Comida', emoji: '🍽️', percent: 15 },
  { key: 'TRANSPORTE', label: 'Transporte', emoji: '🚗', percent: 10 },
  { key: 'VIVIENDA', label: 'Vivienda', emoji: '🏠', percent: 30 },
  { key: 'INVERSIONES', label: 'Inversiones', emoji: '📈', percent: 10 },
  { key: 'ENTRETENIMIENTO', label: 'Entretenimiento', emoji: '🎉', percent: 5 },
];
const SAVINGS_PERCENT = 20;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

export default function RecomendacionesPage() {
  const { token } = useAuth();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomesRes, expensesRes] = await Promise.all([
        fetch('/api/incomes', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/expenses', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setIncomes(incomesRes.ok ? await incomesRes.json() : []);
      setExpenses(expensesRes.ok ? await expensesRes.json() : []);
    } catch {
      setIncomes([]);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsRecommended = totalIncome * SAVINGS_PERCENT / 100;
  const savingsReal = totalIncome - totalExpenses;

  const getCategorySpent = (cat: string) =>
    expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);

  // Generar recomendaciones personalizadas
  const recomendaciones = [] as any[];
  if (totalIncome > 0) {
    // Ahorro
    if (savingsReal < savingsRecommended) {
      recomendaciones.push({
        tipo: 'Ahorro',
        titulo: 'Aumenta tu ahorro mensual',
        descripcion: `Estás ahorrando ${((savingsReal/totalIncome)*100).toFixed(1)}% de tus ingresos. Se recomienda ahorrar al menos el ${SAVINGS_PERCENT}%.`,
        impacto: `Ahorro recomendado: ${formatCurrency(savingsRecommended)}`,
        prioridad: 'alta',
        icono: '💡',
        color: '#ef4444'
      });
    } else {
      recomendaciones.push({
        tipo: 'Ahorro',
        titulo: '¡Buen trabajo ahorrando!',
        descripcion: `Estás ahorrando ${((savingsReal/totalIncome)*100).toFixed(1)}% de tus ingresos. Sigue así para mantener tu salud financiera.`,
        impacto: 'Ahorro óptimo',
        prioridad: 'media',
        icono: '💰',
        color: '#10b981'
      });
    }
    // Por categoría
    CATEGORIES.forEach(cat => {
      const recomendado = totalIncome * cat.percent / 100;
      const gastado = getCategorySpent(cat.key);
      if (gastado > recomendado) {
        recomendaciones.push({
          tipo: 'Presupuesto',
          titulo: `Reduce tus gastos en ${cat.label.toLowerCase()}`,
          descripcion: `Has gastado ${formatCurrency(gastado)} en ${cat.label.toLowerCase()}, superando el recomendado de ${formatCurrency(recomendado)}.`,
          impacto: `Reduce al menos ${formatCurrency(gastado - recomendado)} para equilibrar tu presupuesto.`,
          prioridad: 'alta',
          icono: cat.emoji,
          color: '#f59e0b'
        });
      } else {
        recomendaciones.push({
          tipo: 'Presupuesto',
          titulo: `Vas bien en ${cat.label.toLowerCase()}`,
          descripcion: `Tus gastos en ${cat.label.toLowerCase()} están dentro del presupuesto recomendado.`,
          impacto: '¡Sigue así!',
          prioridad: 'baja',
          icono: cat.emoji,
          color: '#10b981'
        });
      }
    });
    // Inversiones
    if (getCategorySpent('INVERSIONES') < totalIncome * 0.05) {
      recomendaciones.push({
        tipo: 'Inversión',
        titulo: 'Invierte una mayor proporción de tus ingresos',
        descripcion: 'Tus inversiones representan menos del 5% de tus ingresos. Considera destinar más a inversiones para tu futuro.',
        impacto: 'Mejora tu seguridad financiera',
        prioridad: 'media',
        icono: '📈',
        color: '#6366f1'
      });
    }
  }

  if (loading) return <div className="main-dashboard dashboard-premium-bg"><p className="text-center text-white">Cargando recomendaciones...</p></div>;

  return (
    <div className="main-dashboard dashboard-premium-bg">
      <DashboardTitle title="Recomendaciones Personalizadas" subtitle="Consejos inteligentes según tus datos reales" className="premium-title" />
      <div className="dashboard-premium-grid mb-8">
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">💡</div>
          <div className="dashboard-premium-label">RECOMENDACIONES</div>
          <div className="dashboard-premium-value">{recomendaciones.length}</div>
          <div className="dashboard-premium-desc">Activas este mes</div>
        </div>
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">💰</div>
          <div className="dashboard-premium-label">AHORRO POTENCIAL</div>
          <div className="dashboard-premium-value">{formatCurrency(recomendaciones.filter(r => r.prioridad === 'alta').length * 50000)}</div>
          <div className="dashboard-premium-desc">Estimado mensual</div>
        </div>
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">📊</div>
          <div className="dashboard-premium-label">SCORE FINANCIERO</div>
          <div className="dashboard-premium-value">{Math.max(60, Math.min(100, Math.round((savingsReal/totalIncome)*100 + 60)))} / 100</div>
          <div className="dashboard-premium-desc">Basado en tu ahorro</div>
        </div>
      </div>
      <h2 className="text-xl font-bold text-gold mb-4 mt-8 text-center">Tus recomendaciones</h2>
      <div className="dashboard-premium-categories-grid">
        {recomendaciones.map((rec, i) => (
          <div key={i} className="dashboard-premium-category-card" style={{ borderLeft: `5px solid ${rec.color}` }}>
            <div className="dashboard-premium-category-icon" style={{ color: rec.color }}>{rec.icono}</div>
            <div className="dashboard-premium-category-label">{rec.titulo}</div>
            <div className="dashboard-premium-desc" style={{ color: rec.color }}>{rec.descripcion}</div>
            <div className="dashboard-premium-category-value mt-2">{rec.impacto}</div>
            <div className={`mt-2 text-xs font-bold ${rec.prioridad === 'alta' ? 'text-red-600' : rec.prioridad === 'media' ? 'text-yellow-500' : 'text-green-600'}`}>{rec.prioridad.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
