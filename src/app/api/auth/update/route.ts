import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt, hashPassword } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
    }

    const token = auth.replace('Bearer ', '');
    const payload = verifyJwt(token);
    if (!payload || typeof payload !== 'object' || !('id' in payload)) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
    }

    const { name, email, currentPassword, newPassword } = await req.json();
    const userId = payload.id as string;

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    }

    // Si se está cambiando la contraseña, verificar la actual
    if (newPassword && currentPassword) {
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Contraseña actual incorrecta.' }, { status: 400 });
      }
    }

    // Verificar si el email ya existe (si se está cambiando)
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'El email ya está en uso.' }, { status: 400 });
      }
    }

    // Actualizar datos
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (newPassword) updateData.password = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      plan: updatedUser.plan
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
} 