import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isInt(n: unknown) {
  return typeof n === 'number' && Number.isInteger(n);
}

// POST /api/factories/[id]/generate - Regenerate children for a factory
// @ts-expect-error: Next.js does not provide a type for context
export async function POST(req: NextRequest, context) {
  // Type assertion for params to maintain type safety
  const id = Number((context as { params: { id: string } }).params.id);
  let lower_bound, upper_bound;
  try {
    // Try to parse JSON, but allow empty body
    const body = await req.json().catch(() => ({}));
    lower_bound = body.lower_bound;
    upper_bound = body.upper_bound;
  } catch {
    lower_bound = undefined;
    upper_bound = undefined;
  }

  // Fetch factory and get children_count
  const factory = await prisma.factory.findUnique({ where: { id } });
  if (!factory) return NextResponse.json({ error: 'Factory not found.' }, { status: 404 });

  const count = factory.children_count;

  // Use provided bounds if valid, otherwise use factory's
  const lb = isInt(lower_bound) ? lower_bound : factory.lower_bound;
  const ub = isInt(upper_bound) ? upper_bound : factory.upper_bound;
  if (!isInt(lb) || !isInt(ub) || lb > ub) {
    return NextResponse.json({ error: 'Invalid bounds.' }, { status: 400 });
  }

  // Delete existing children
  await prisma.child.deleteMany({ where: { factoryId: id } });

  // Generate new children
  if (count > 0) {
    const childrenData = Array.from({ length: count }, () => ({
      value: Math.floor(Math.random() * (ub - lb + 1)) + lb,
      factoryId: id,
    }));
    await prisma.child.createMany({ data: childrenData });
  }

  return NextResponse.json({ success: true });
}
