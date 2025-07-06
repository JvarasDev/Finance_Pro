import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signJwt } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
  }
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
  }
  const token = signJwt({ id: user.id, email: user.email });
  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } });
} 