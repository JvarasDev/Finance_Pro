import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Costo de vida promedio en Chile (valores de ejemplo en CLP)
const COSTO_VIDA = {
  comida: 0.25, // 25% del ingreso
  transporte: 0.15, // 15%
  entretenimiento: 0.10, // 10%
  otros: 0.20, // 20%
  ahorro: 0.30 // 30%
};

const CONSEJOS = {
  comida: 'Compra en ferias y aprovecha ofertas semanales.',
  transporte: 'Prefiere transporte público o comparte viajes.',
  entretenimiento: 'Busca actividades gratuitas o con descuento.',
  otros: 'Revisa tus suscripciones y elimina las innecesarias.',
  ahorro: 'Intenta ahorrar al menos un 10% de tu ingreso mensual.'
};

export async function POST(request: Request) {
  const { income, month, year } = await request.json();
  if (!income || !month || !year) {
    return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 });
  }

  // Calcular recomendaciones
  const recomendaciones = Object.entries(COSTO_VIDA).map(([categoria, porcentaje]) => ({
    category: categoria,
    amount: +(income * porcentaje).toFixed(0),
    advice: CONSEJOS[categoria as keyof typeof CONSEJOS] || ''
  }));

  // Guardar en la base de datos
  const userIncome = await prisma.userIncome.create({
    data: {
      income,
      month,
      year,
      recommendations: {
        create: recomendaciones
      }
    },
    include: { recommendations: true }
  });

  return NextResponse.json(userIncome);
}

export async function GET() {
  // Devuelve todos los ingresos y recomendaciones
  const data = await prisma.userIncome.findMany({
    include: { recommendations: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(data);
}
