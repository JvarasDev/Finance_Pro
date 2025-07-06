"use client";
import GlassPanel from '@/components/GlassPanel';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DashboardTitle from '@/components/DashboardTitle';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Income {
  amount: number;
}
interface Expense {
  amount: number;
  category: string;
}

const CATEGORIES = [
  { key: 'ALIMENTACION', label: 'Comida', emoji: '🍽️', percent: 15 },
  { key: 'TRANSPORTE', label: 'Transporte', emoji: '🚗', percent: 10 },
  { key: 'VIVIENDA', label: 'Vivienda', emoji: '🏠', percent: 30 },
  { key: 'INVERSIONES', label: 'Inversiones', emoji: '📈', percent: 10 },
  { key: 'ENTRETENIMIENTO', label: 'Entretenimiento', emoji: '🎉', percent: 5 },
];
const SAVINGS_PERCENT = 20;

export default function AnalisisPage() {
  const { token } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomesRes, expensesRes] = await Promise.all([
        fetch('/api/incomes', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/expenses', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const incomesData = incomesRes.ok ? await incomesRes.json() : [];
      const expensesData = expensesRes.ok ? await expensesRes.json() : [];
      setIncomes(incomesData);
      setExpenses(expensesData);
    } catch (e) {
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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

  if (loading) return <div className="main-dashboard dashboard-premium-bg"><p className="text-center text-white">Cargando análisis...</p></div>;

  return (
    <div className="main-dashboard dashboard-premium-bg">
      <DashboardTitle title="Análisis Financiero" subtitle="Compara tus gastos reales con los recomendados" className="premium-title" />
      <div className="dashboard-premium-grid mb-8">
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">💰</div>
          <div className="dashboard-premium-label">INGRESOS</div>
          <div className="dashboard-premium-value">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">💸</div>
          <div className="dashboard-premium-label">GASTOS</div>
          <div className="dashboard-premium-value">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">💡</div>
          <div className="dashboard-premium-label">AHORRO RECOMENDADO</div>
          <div className="dashboard-premium-value">{formatCurrency(savingsRecommended)}</div>
          <div className="dashboard-premium-desc">{SAVINGS_PERCENT}% de tus ingresos</div>
        </div>
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">✅</div>
          <div className="dashboard-premium-label">AHORRO REAL</div>
          <div className={`dashboard-premium-value ${savingsReal >= savingsRecommended ? '' : 'text-red-600'}`}>{formatCurrency(savingsReal)}</div>
          {savingsReal < savingsRecommended && <div className="dashboard-premium-desc text-red-600">¡Estás ahorrando menos de lo recomendado!</div>}
        </div>
      </div>
      <h2 className="text-xl font-bold text-gold mb-4 mt-8 text-center">Presupuesto recomendado vs. gasto real</h2>
      <div className="dashboard-premium-categories-grid">
        {CATEGORIES.map(cat => {
          const recommended = totalIncome * cat.percent / 100;
          const spent = getCategorySpent(cat.key);
          return (
            <div className="dashboard-premium-category-card" key={cat.key}>
              <div className="dashboard-premium-category-icon">{cat.emoji}</div>
              <div className="dashboard-premium-category-label">{cat.label.toUpperCase()}</div>
              <div className={`dashboard-premium-category-value ${spent > recommended ? 'text-red-600' : ''}`}>{formatCurrency(spent)}</div>
              <div className="dashboard-premium-desc" style={{ color: '#ffb300' }}>Recomendado: {formatCurrency(recommended)}</div>
              {spent > recommended && <div className="dashboard-premium-desc text-red-600">¡Has superado el presupuesto!</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
