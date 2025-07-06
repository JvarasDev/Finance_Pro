"use client";
"use client";
import GlassPanel from '@/components/GlassPanel';
import React, { useState, useEffect } from 'react';
import DashboardTitle from '@/components/DashboardTitle';
import { useAuth } from '@/contexts/AuthContext';
import PremiumForm from '@/components/PremiumForm';

interface Income {
  id: string;
  description: string;
  amount: number;
  type: 'SALARIO' | 'FREELANCE' | 'INVERSIONES' | 'OTROS';
  frequency: 'MENSUAL' | 'QUINCENAL' | 'SEMANAL' | 'UNICO';
  date: string;
  createdAt: string;
}

const categorias = [
  { nombre: 'Salario', porcentaje: 75, color: '#10b981', icono: '💼' },
  { nombre: 'Freelance', porcentaje: 16, color: '#3b82f6', icono: '💻' },
  { nombre: 'Inversiones', porcentaje: 5, color: '#f59e0b', icono: '📈' },
  { nombre: 'Otros', porcentaje: 4, color: '#8b5cf6', icono: '💰' }
];

const GASTO_CATEGORIES = [
  { value: 'ALIMENTACION', label: 'Comida', emoji: '🍽️' },
  { value: 'TRANSPORTE', label: 'Transporte', emoji: '🚗' },
  { value: 'VIVIENDA', label: 'Vivienda', emoji: '🏠' },
  { value: 'INVERSIONES', label: 'Inversiones', emoji: '📈' },
  { value: 'ENTRETENIMIENTO', label: 'Entretenimiento', emoji: '🎉' },
  { value: 'OTROS', label: 'Otros', emoji: '📦' },
];

export default function IngresosPage() {
  const { token } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'SALARIO' as const,
    frequency: 'MENSUAL' as const,
    date: new Date().toISOString().split('T')[0]
  });

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'ALIMENTACION',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (token) {
      fetchIncomes();
    }
  }, [token]);

  const fetchIncomes = async () => {
    try {
      const response = await fetch('/api/incomes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setIncomes(data);
      }
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/incomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.type,
          frequency: formData.frequency,
          date: formData.date
        })
      });

      if (response.ok) {
        setFormData({
          description: '',
          amount: '',
          type: 'SALARIO',
          frequency: 'MENSUAL',
          date: new Date().toISOString().split('T')[0]
        });
        setShowForm(false);
        fetchIncomes();
        alert('Ingreso agregado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al agregar ingreso');
      }
    } catch (error) {
      console.error('Error adding income:', error);
      alert('Error de conexión');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este ingreso?')) return;
    
    try {
      const response = await fetch(`/api/incomes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchIncomes();
        alert('Ingreso eliminado exitosamente');
      } else {
        alert('Error al eliminar ingreso');
      }
    } catch (error) {
      console.error('Error deleting income:', error);
      alert('Error de conexión');
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: expenseForm.description,
          amount: parseFloat(expenseForm.amount),
          category: expenseForm.category,
          date: expenseForm.date
        })
      });
      if (response.ok) {
        setExpenseForm({
          description: '',
          amount: '',
          category: 'ALIMENTACION',
          date: new Date().toISOString().split('T')[0]
        });
        setShowExpenseForm(false);
        fetchIncomes(); // Para refrescar el dashboard
        alert('Gasto registrado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al registrar gasto');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error de conexión');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      SALARIO: 'Salario',
      FREELANCE: 'Freelance',
      INVERSIONES: 'Inversiones',
      OTROS: 'Otros'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      MENSUAL: 'Mensual',
      QUINCENAL: 'Quincenal',
      SEMANAL: 'Semanal',
      UNICO: 'Único'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  if (loading) {
    return (
      <div className="main-dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando ingresos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-dashboard dashboard-premium-bg">
      <DashboardTitle 
        title="Gestión de Ingresos" 
        subtitle="Registra y gestiona todas tus fuentes de ingresos" 
        className="premium-title"
      />
      <div className="dashboard-premium-grid mb-8">
        <div className="dashboard-premium-card">
          <div className="dashboard-premium-icon">💰</div>
          <div className="dashboard-premium-label">TOTAL INGRESOS</div>
          <div className="dashboard-premium-value">{formatCurrency(totalIncome)}</div>
          <div className="dashboard-premium-desc">Suma de todos tus ingresos</div>
        </div>
        <div className="dashboard-premium-card flex flex-col items-center justify-center">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary w-full mb-3"
          >
            {showForm ? '❌ Cancelar' : '➕ Agregar Ingreso'}
          </button>
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="btn btn-secondary w-full"
          >
            {showExpenseForm ? '❌ Cancelar' : '💸 Registrar Gasto'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="premium-modal-overlay">
          <div className="premium-modal">
            <button className="premium-modal-close" onClick={() => setShowForm(false)} title="Cerrar">×</button>
            <PremiumForm
              title="Nuevo Ingreso"
              icon="💰"
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              submitLabel="💾 Guardar Ingreso"
              fields={[
                {
                  name: 'description',
                  label: 'Descripción',
                  type: 'text',
                  value: formData.description,
                  onChange: e => setFormData({ ...formData, description: e.target.value }),
                  placeholder: 'Ej: Sueldo, proyecto, etc.',
                  required: true
                },
                {
                  name: 'amount',
                  label: 'Monto',
                  type: 'number',
                  value: formData.amount,
                  onChange: e => setFormData({ ...formData, amount: e.target.value }),
                  placeholder: 'Ej: 500000',
                  required: true
                },
                {
                  name: 'type',
                  label: 'Tipo',
                  type: 'select',
                  value: formData.type,
                  onChange: e => setFormData({ ...formData, type: e.target.value as any }),
                  options: [
                    { value: 'SALARIO', label: 'Salario' },
                    { value: 'FREELANCE', label: 'Freelance' },
                    { value: 'INVERSIONES', label: 'Inversiones' },
                    { value: 'OTROS', label: 'Otros' }
                  ],
                  required: true
                },
                {
                  name: 'frequency',
                  label: 'Frecuencia',
                  type: 'select',
                  value: formData.frequency,
                  onChange: e => setFormData({ ...formData, frequency: e.target.value as any }),
                  options: [
                    { value: 'MENSUAL', label: 'Mensual' },
                    { value: 'QUINCENAL', label: 'Quincenal' },
                    { value: 'SEMANAL', label: 'Semanal' },
                    { value: 'UNICO', label: 'Único' }
                  ],
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
          </div>
        </div>
      )}

      {showExpenseForm && (
        <div className="premium-modal-overlay">
          <div className="premium-modal">
            <button className="premium-modal-close" onClick={() => setShowExpenseForm(false)} title="Cerrar">×</button>
            <PremiumForm
              title="Registrar Gasto"
              icon="💸"
              onSubmit={handleExpenseSubmit}
              onCancel={() => setShowExpenseForm(false)}
              submitLabel="💾 Guardar Gasto"
              fields={[
                {
                  name: 'description',
                  label: 'Descripción',
                  type: 'text',
                  value: expenseForm.description,
                  onChange: e => setExpenseForm({ ...expenseForm, description: e.target.value }),
                  placeholder: 'Ej: Supermercado, arriendo, etc.',
                  required: true
                },
                {
                  name: 'amount',
                  label: 'Monto',
                  type: 'number',
                  value: expenseForm.amount,
                  onChange: e => setExpenseForm({ ...expenseForm, amount: e.target.value }),
                  placeholder: 'Ej: 10000',
                  required: true
                },
                {
                  name: 'category',
                  label: 'Categoría',
                  type: 'select',
                  value: expenseForm.category,
                  onChange: e => setExpenseForm({ ...expenseForm, category: e.target.value }),
                  options: GASTO_CATEGORIES.map(cat => ({ value: cat.value, label: `${cat.emoji} ${cat.label}` })),
                  required: true
                },
                {
                  name: 'date',
                  label: 'Fecha',
                  type: 'date',
                  value: expenseForm.date,
                  onChange: e => setExpenseForm({ ...expenseForm, date: e.target.value }),
                  required: true
                }
              ]}
            />
          </div>
        </div>
      )}

      <div className="dashboard-premium-categories-grid mt-8">
        {incomes.length === 0 ? (
          <div className="dashboard-premium-category-card text-center">
            <div className="dashboard-premium-category-icon">💰</div>
            <h4 className="dashboard-premium-category-label">No hay ingresos registrados</h4>
            <div className="dashboard-premium-desc">Comienza agregando tu primer ingreso para ver tu resumen financiero</div>
          </div>
        ) : (
          incomes.map((income) => (
            <div className="dashboard-premium-category-card" key={income.id}>
              <div className="dashboard-premium-category-icon">💰</div>
              <div className="dashboard-premium-category-label">{income.description}</div>
              <div className="dashboard-premium-category-value text-green-600">{formatCurrency(income.amount)}</div>
              <div className="dashboard-premium-desc">
                <span className="mr-2">{getTypeLabel(income.type)}</span>
                <span className="mr-2">{getFrequencyLabel(income.frequency)}</span>
                <span>{formatDate(income.date)}</span>
              </div>
              <button
                onClick={() => handleDelete(income.id)}
                className="btn btn-secondary text-red-600 hover:bg-red-50 mt-3"
              >
                🗑️ Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
