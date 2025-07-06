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
  const expenses = await prisma.expense.findMany({
    where: { userId: payload.id as string },
    orderBy: { date: 'desc' }
  });
  return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const token = auth.replace('Bearer ', '');
  const payload = verifyJwt(token);
  if (!payload || typeof payload !== 'object' || !('id' in payload)) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
  }
  const { amount, category, description, date } = await req.json();
  if (!amount || !category || !date) {
    return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 });
  }
  const expense = await prisma.expense.create({
    data: {
      userId: payload.id as string,
      amount,
      category,
      description,
      date: new Date(date)
    }
  });
  return NextResponse.json(expense);
} 