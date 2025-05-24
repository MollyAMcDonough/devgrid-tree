import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isInt(n: unknown) {
  return typeof n === 'number' && Number.isInteger(n);
}

// Helper to emit socket events
async function emitSocketEvent(event: string, data: unknown) {
  try {
    await fetch('http://localhost:4000/emit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data }),
    });
  } catch (err) {
    console.error('Socket emit failed:', err);
  }
}

// GET /api/factories/[id] - Get single factory (with children)
// @ts-expect-error: Next.js does not provide a type for context
export async function GET(_req: NextRequest, context) {
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
  const id = Number((context as { params: { id: string } }).params.id);
  const { name, lower_bound, upper_bound } = await req.json();

  const factory = await prisma.factory.findUnique({ where: { id }, include: { children: true } });
  if (!factory) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updates: Partial<{ name: string; lower_bound: number; upper_bound: number }> = {};
  let regenerate = false;

  // Validate and update name
  if (typeof name === 'string' && name.trim() !== factory.name) {
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > 100) {
      return NextResponse.json({ error: 'Name must be 1-100 characters.' }, { status: 400 });
    }
    updates.name = trimmed;
  }

  // Validate and update bounds
  const lowerChanged = typeof lower_bound === 'number' && lower_bound !== factory.lower_bound;
  const upperChanged = typeof upper_bound === 'number' && upper_bound !== factory.upper_bound;
  const boundsChanged = lowerChanged || upperChanged;

  if (boundsChanged) {
    const newLower = lowerChanged ? lower_bound : factory.lower_bound;
    const newUpper = upperChanged ? upper_bound : factory.upper_bound;
    if (!isInt(newLower) || !isInt(newUpper) || newLower > newUpper) {
      return NextResponse.json({ error: 'Invalid bounds.' }, { status: 400 });
    }
    updates.lower_bound = newLower;
    updates.upper_bound = newUpper;
    regenerate = true;
  }

  // If nothing to update, return current factory (with children)
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(factory);
  }

  // Update the factory
  await prisma.factory.update({
    where: { id },
    data: updates,
  });

  // If bounds changed, delete all children and regenerate
  if (regenerate) {
    await prisma.child.deleteMany({ where: { factoryId: id } });

    // Regenerate children (same logic as /generate endpoint)
    const count = factory.children_count;
    const lb = updates.lower_bound ?? factory.lower_bound;
    const ub = updates.upper_bound ?? factory.upper_bound;

    if (count > 0) {
      const childrenData = Array.from({ length: count }, () => ({
        value: Math.floor(Math.random() * (ub - lb + 1)) + lb,
        factoryId: id,
      }));
      await prisma.child.createMany({ data: childrenData });
    }
  }

  // Return the updated factory with children
  const updatedFactory = await prisma.factory.findUnique({
    where: { id },
    include: { children: true },
  });

  // Emit real-time update
  await emitSocketEvent('factories-updated', updatedFactory);

  return NextResponse.json(updatedFactory);
}

// DELETE /api/factories/[id] - Delete factory and children (cascade)
// @ts-expect-error: Next.js does not provide a type for context
export async function DELETE(_req: NextRequest, context) {
  const id = Number((context as { params: { id: string } }).params.id);
  try {
    await prisma.factory.delete({ where: { id } });
    // Emit real-time update (no data needed, just trigger refetch)
    await emitSocketEvent('factories-updated', { id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
