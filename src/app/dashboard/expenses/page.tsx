'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTitle from '@/components/DashboardTitle';
import GlassPanel from '@/components/GlassPanel';
import PremiumForm from '@/components/PremiumForm';

const CATEGORIES = [
  { value: 'ALIMENTACION', label: 'Comida', emoji: '🍽️' },
  { value: 'TRANSPORTE', label: 'Transporte', emoji: '🚗' },
  { value: 'VIVIENDA', label: 'Vivienda', emoji: '🏠' },
  { value: 'INVERSIONES', label: 'Inversiones', emoji: '📈' },
  { value: 'ENTRETENIMIENTO', label: 'Entretenimiento', emoji: '🎉' },
  { value: 'OTROS', label: 'Otros', emoji: '📦' },
];

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export default function ExpensesPage() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'ALIMENTACION',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (token) fetchExpenses();
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date
        })
      });
      if (response.ok) {
        setFormData({
          description: '',
          amount: '',
          category: 'ALIMENTACION',
          date: new Date().toISOString().split('T')[0]
        });
        setShowForm(false);
        fetchExpenses();
        alert('Gasto agregado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al agregar gasto');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error de conexión');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este gasto?')) return;
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchExpenses();
        alert('Gasto eliminado exitosamente');
      } else {
        alert('Error al eliminar gasto');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error de conexión');
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-CL');

  if (loading) {
    return (
      <div className="main-dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando gastos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-dashboard">
      <DashboardTitle 
        title="Gestión de Gastos" 
        subtitle="Registra y gestiona todos tus gastos por categoría" 
      />
      <div className="glass-panel mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Resumen de Gastos</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '❌ Cancelar' : '➕ Agregar Gasto'}
          </button>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-red-600 mb-2">
            {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
          </div>
          <p className="text-gray-600">Total de gastos registrados</p>
        </div>
      </div>
      {showForm && (
        <PremiumForm
          title="Registrar Gasto"
          icon="💸"
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          submitLabel="💾 Guardar Gasto"
          fields={[
            {
              name: 'description',
              label: 'Descripción',
              type: 'text',
              value: formData.description,
              onChange: e => setFormData({ ...formData, description: e.target.value }),
              placeholder: 'Ej: Supermercado, arriendo, etc.',
              required: true
            },
            {
              name: 'amount',
              label: 'Monto (CLP)',
              type: 'number',
              value: formData.amount,
              onChange: e => setFormData({ ...formData, amount: e.target.value }),
              placeholder: '50000',
              required: true
            },
            {
              name: 'category',
              label: 'Categoría',
              type: 'select',
              value: formData.category,
              onChange: e => setFormData({ ...formData, category: e.target.value }),
              options: CATEGORIES.map(cat => ({ value: cat.value, label: `${cat.emoji} ${cat.label}` })),
              required: true
            },
            {
              name: 'date',
              label: 'Fecha',
              type: 'date',
              value: formData.date,
              onChange: e => setFormData({ ...formData, date: e.target.value }),
              required: true
            }
          ]}
        />
      )}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Gastos Registrados</h3>
        {expenses.length === 0 ? (
          <GlassPanel className="text-center">
            <div className="text-4xl mb-4">💸</div>
            <h4 className="text-lg font-semibold mb-2">No hay gastos registrados</h4>
            <p className="text-gray-600 mb-4">
              Comienza agregando tu primer gasto para ver tu resumen financiero
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              ➕ Agregar Primer Gasto
            </button>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {expenses.map((expense) => (
              <GlassPanel key={expense.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {CATEGORIES.find(c => c.value === expense.category)?.emoji || '📦'}
                      </span>
                      <h4 className="text-lg font-semibold">{expense.description}</h4>
                      <span className="text-2xl font-bold text-red-600">
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>🏷️ {CATEGORIES.find(c => c.value === expense.category)?.label || expense.category}</span>
                      <span>📅 {formatDate(expense.date)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="btn btn-secondary text-red-600 hover:bg-red-50"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 