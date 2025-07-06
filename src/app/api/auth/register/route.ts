import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, name, password } = await req.json();
  if (!email || !name || !password) {
    return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 });
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: 'El usuario ya existe.' }, { status: 409 });
  }
  const hash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, name, password: hash }
  });
  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
} 