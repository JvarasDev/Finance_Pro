import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

// Promedios de costo de vida en Chile (valores aproximados en CLP)
const COSTO_VIDA_CHILE = {
  vivienda: 400000,
  alimentacion: 250000,
  transporte: 120000,
  entretenimiento: 80000,
  salud: 60000,
  otros: 70000,
  ahorro: 300000
};

const CONSEJOS = {
  vivienda: 'Intenta que tu gasto en vivienda no supere el 30% de tu ingreso.',
  alimentacion: 'Aprovecha ferias y ofertas para reducir tu gasto en comida.',
  transporte: 'Prefiere transporte público o comparte viajes.',
  entretenimiento: 'Busca actividades gratuitas o con descuento.',
  salud: 'Mantén un fondo para emergencias médicas.',
  otros: 'Revisa tus suscripciones y elimina las innecesarias.',
  ahorro: 'Intenta ahorrar al menos un 10-20% de tu ingreso mensual.'
};

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const token = auth.replace('Bearer ', '');
  const payload = verifyJwt(token);
  if (!payload || typeof payload !== 'object' || !('id' in payload)) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
  }
  // Obtener ingresos y gastos del usuario
  const incomes = await prisma.income.findMany({ where: { userId: payload.id as string } });
  const expenses = await prisma.expense.findMany({ where: { userId: payload.id as string } });
  const totalIngreso = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalGasto = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Generar recomendaciones
  const recomendaciones = Object.entries(COSTO_VIDA_CHILE).map(([categoria, valor]) => {
    let gastoUsuario = 0;
    if (categoria === 'ahorro') {
      gastoUsuario = totalIngreso - totalGasto;
    } else {
      gastoUsuario = expenses.filter(e => e.category.toLowerCase() === categoria).reduce((sum, e) => sum + e.amount, 0);
    }
    return {
      categoria,
      sugerido: valor,
      actual: gastoUsuario,
      consejo: CONSEJOS[categoria as keyof typeof CONSEJOS] || ''
    };
  });

  return NextResponse.json({ totalIngreso, totalGasto, recomendaciones });
} 