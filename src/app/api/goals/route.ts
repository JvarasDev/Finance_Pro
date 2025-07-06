import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const token = auth.replace('Bearer ', '');
  const payload = verifyJwt(token);
  if (!payload || typeof payload !== 'object' || !('id' in payload)) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
  }
  const goals = await prisma.goal.findMany({
    where: { userId: payload.id as string },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const token = auth.replace('Bearer ', '');
  const payload = verifyJwt(token);
  if (!payload || typeof payload !== 'object' || !('id' in payload)) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
  }
  const { name, targetAmount, deadline, icon, color } = await req.json();
  if (!name || !targetAmount || !icon || !color) {
    return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 });
  }
  const goal = await prisma.goal.create({
    data: {
      userId: payload.id as string,
      name,
      targetAmount,
      icon,
      color,
      deadline: deadline ? new Date(deadline) : null
    }
  });
  return NextResponse.json(goal);
} 