import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      role: session.user.role,
    },
  });
};

export const POST = async (request: NextRequest) => {
  return (await import('@/auth')).handlers.POST(request);
};