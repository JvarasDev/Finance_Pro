import { prisma } from './prisma';
import { hashPassword } from './auth';

export async function initializeDatabase() {
  try {
    // Verificar si ya hay datos
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      console.log('Inicializando base de datos con datos de ejemplo...');
      
      // Crear usuario de ejemplo
      const hashedPassword = await hashPassword('demo123');
      const demoUser = await prisma.user.create({
        data: {
          email: 'demo@financepro.cl',
          name: 'Usuario Demo',
          password: hashedPassword,
          plan: 'PREMIUM'
        }
      });

      // Crear ingresos de ejemplo
      await prisma.income.createMany({
        data: [
          {
            userId: demoUser.id,
            amount: 800000,
            category: 'SALARIO',
            description: 'Salario mensual',
            date: new Date()
          },
          {
            userId: demoUser.id,
            amount: 150000,
            category: 'FREELANCE',
            description: 'Proyecto freelance',
            date: new Date()
          }
        ]
      });

      // Crear gastos de ejemplo
      await prisma.expense.createMany({
        data: [
          {
            userId: demoUser.id,
            amount: 250000,
            category: 'ALIMENTACION',
            description: 'Supermercado mensual',
            date: new Date()
          },
          {
            userId: demoUser.id,
            amount: 400000,
            category: 'VIVIENDA',
            description: 'Arriendo',
            date: new Date()
          },
          {
            userId: demoUser.id,
            amount: 80000,
            category: 'TRANSPORTE',
            description: 'Transporte público',
            date: new Date()
          }
        ]
      });

      // Crear metas de ejemplo
      await prisma.goal.createMany({
        data: [
          {
            userId: demoUser.id,
            name: 'Vacaciones',
            targetAmount: 2000000,
            currentAmount: 500000,
            deadline: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 meses
            icon: '🏖️',
            color: '#3b82f6'
          },
          {
            userId: demoUser.id,
            name: 'Fondo de emergencia',
            targetAmount: 3000000,
            currentAmount: 1200000,
            deadline: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000), // 3 meses
            icon: '🛡️',
            color: '#10b981'
          }
        ]
      });

      console.log('Base de datos inicializada correctamente');
    }
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
  }
} 