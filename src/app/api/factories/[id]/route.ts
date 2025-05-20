import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/factories/[id] - Get single factory (with children)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const factory = await prisma.factory.findUnique({
    where: { id },
    include: { children: true },
  });
  if (!factory) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(factory);
}

// PATCH /api/factories/[id] - Update name or bounds (regenerate children if bounds change)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { name, lower_bound, upper_bound } = await req.json();

  const factory = await prisma.factory.findUnique({ where: { id } });
  if (!factory) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updates: Partial<{ name: string; lower_bound: number; upper_bound: number }> = {};
  let regenerate = false;

  if (typeof name === 'string' && name.length >= 1 && name.length <= 100) {
    updates.name = name;
  }
  if (
    (typeof lower_bound === 'number' && lower_bound !== factory.lower_bound) ||
    (typeof upper_bound === 'number' && upper_bound !== factory.upper_bound)
  ) {
    if (
      typeof lower_bound !== 'number' ||
      typeof upper_bound !== 'number' ||
      lower_bound > upper_bound
    ) {
      return NextResponse.json({ error: 'Invalid bounds.' }, { status: 400 });
    }
    updates.lower_bound = lower_bound;
    updates.upper_bound = upper_bound;
    regenerate = true;
  }

  const updatedFactory = await prisma.factory.update({
    where: { id },
    data: updates,
  });

  // If bounds changed, delete and regenerate children
  if (regenerate) {
    await prisma.child.deleteMany({ where: { factoryId: id } });
    // You may want to trigger a new POST to /generate here or let UI handle it
  }

  return NextResponse.json(updatedFactory);
}

// DELETE /api/factories/[id] - Delete factory and children (cascade)
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    await prisma.factory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
