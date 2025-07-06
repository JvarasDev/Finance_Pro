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

  // Guardar en la base de datos usando el modelo income correcto
  const userIncome = await prisma.income.create({
    data: {
      amount: income,
      category: 'SALARIO', // Categoría por defecto
      description: `Ingreso de ${month}/${year}`,
      date: new Date(year, parseInt(month) - 1, 1), // Primer día del mes
      userId: 'temp-user-id' // Necesitarás obtener el userId real del token
    }
  });

  return NextResponse.json({
    income: userIncome,
    recommendations: recomendaciones
  });
}

export async function GET() {
  // Devuelve todos los ingresos
  const data = await prisma.income.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(data);
}
