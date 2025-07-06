import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const token = auth.replace('Bearer ', '');
  const payload = verifyJwt(token);
  if (!payload || typeof payload !== 'object' || !('id' in payload)) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: payload.id as string } });
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
  }
  return NextResponse.json({ id: user.id, email: user.email, name: user.name, plan: user.plan });
} 