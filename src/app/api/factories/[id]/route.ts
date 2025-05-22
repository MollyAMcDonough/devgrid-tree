import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isInt(n: unknown) {
  return typeof n === 'number' && Number.isInteger(n);
}

// GET /api/factories/[id] - Get single factory (with children)
// @ts-expect-error: Next.js does not provide a type for context
export async function GET(_req: NextRequest, context) {
  // Type assertion for params to maintain type safety
  const id = Number((context as { params: { id: string } }).params.id);
  const factory = await prisma.factory.findUnique({
    where: { id },
    include: { children: true },
  });
  if (!factory) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(factory);
}

// PATCH /api/factories/[id] - Update name or bounds (regenerate children if bounds change)
// @ts-expect-error: Next.js does not provide a type for context
export async function PATCH(req: NextRequest, context) {
  // Type assertion for params to maintain type safety
  const id = Number((context as { params: { id: string } }).params.id);
  const { name, lower_bound, upper_bound } = await req.json();

  const factory = await prisma.factory.findUnique({ where: { id } });
  if (!factory) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updates: Partial<{ name: string; lower_bound: number; upper_bound: number }> = {};
  let regenerate = false;

  // Validate and update name
  if (typeof name === 'string') {
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > 100) {
      return NextResponse.json({ error: 'Name must be 1-100 characters.' }, { status: 400 });
    }
    updates.name = trimmed;
  }

  // Validate and update bounds
  const boundsChanged =
    (typeof lower_bound === 'number' && lower_bound !== factory.lower_bound) ||
    (typeof upper_bound === 'number' && upper_bound !== factory.upper_bound);

  if (boundsChanged) {
    if (!isInt(lower_bound) || !isInt(upper_bound) || lower_bound > upper_bound) {
      return NextResponse.json({ error: 'Invalid bounds.' }, { status: 400 });
    }
    updates.lower_bound = lower_bound;
    updates.upper_bound = upper_bound;
    regenerate = true;
  }

  // If nothing to update, return current factory
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(factory);
  }

  const updatedFactory = await prisma.factory.update({
    where: { id },
    data: updates,
  });

  // If bounds changed, delete all children (UI or client should trigger regeneration)
  if (regenerate) {
    await prisma.child.deleteMany({ where: { factoryId: id } });
  }

  return NextResponse.json(updatedFactory);
}

// DELETE /api/factories/[id] - Delete factory and children (cascade)
// @ts-expect-error: Next.js does not provide a type for context
export async function DELETE(_req: NextRequest, context) {
  // Type assertion for params to maintain type safety
  const id = Number((context as { params: { id: string } }).params.id);
  try {
    await prisma.factory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
