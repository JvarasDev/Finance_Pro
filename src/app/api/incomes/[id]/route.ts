import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  
  const token = auth.replace('Bearer ', '');
  const payload = verifyJwt(token);
  if (!payload || typeof payload !== 'object' || !('id' in payload)) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
  }

  try {
    // Verificar que el ingreso pertenece al usuario
    const income = await prisma.Income.findFirst({
      where: {
        id: params.id,
        userId: payload.id as string
      }
    });

    if (!income) {
      return NextResponse.json({ error: 'Ingreso no encontrado.' }, { status: 404 });
    }

    // Eliminar el ingreso
    await prisma.Income.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Ingreso eliminado exitosamente.' });
  } catch (error) {
    console.error('Error deleting income:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
} 