import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  
  const token = auth.replace('Bearer ', '');
  const payload = verifyJwt(token);
  if (!payload || typeof payload !== 'object' || !('id' in payload)) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
  }

  try {
    // Verificar que el ingreso pertenece al usuario
    const income = await prisma.income.findFirst({
      where: {
        id: id,
        userId: payload.id as string
      }
    });

    if (!income) {
      return NextResponse.json({ error: 'Ingreso no encontrado.' }, { status: 404 });
    }

    // Eliminar el ingreso
    await prisma.income.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Ingreso eliminado exitosamente.' });
  } catch (error) {
    console.error('Error deleting income:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

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

  // Guardar en la base de datos usando el modelo Income correcto
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