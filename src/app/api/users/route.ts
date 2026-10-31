import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { formatZodError } from '@/lib/api/response';
import { requireRole } from '@/lib/auth/authorization';
import { createUserSchema } from '@/lib/validation/users';
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/users — List all users (Admin only)
 */
export async function GET() {
  try {
    await requireRole('ADMIN');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      throw error;
    }
    console.error('[GET /api/users] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users — Create a new user (Admin only)
 *
 * Accepts: name, phone, password, role
 * The password is hashed before saving to the database.
 */
export async function POST(request: NextRequest) {
  try {
    // Enforce Admin-only access at the API gate
    await requireRole('ADMIN');

    const body = await request.json();

    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { name, phone, password, role } = parsed.data;

    // Idempotent upsert by phone — if a user with this phone already exists,
    // return a conflict rather than silently overwriting.
    const existing = await prisma.user.findUnique({
      where: { phone },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A user with this phone number already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        passwordHash,
        role,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newUser,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      throw error;
    }
    console.error('[POST /api/users] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}