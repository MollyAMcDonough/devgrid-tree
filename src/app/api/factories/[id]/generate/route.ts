import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/factories/[id]/generate - Regenerate children for a factory
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { count, lower_bound, upper_bound } = await req.json();

  // Validate count
  if (typeof count !== 'number' || count < 1 || count > 15) {
    return NextResponse.json({ error: 'Invalid count.' }, { status: 400 });
  }

  // Fetch factory and determine bounds to use
  const factory = await prisma.factory.findUnique({ where: { id } });
  if (!factory) return NextResponse.json({ error: 'Factory not found.' }, { status: 404 });

  const lb = typeof lower_bound === 'number' ? lower_bound : factory.lower_bound;
  const ub = typeof upper_bound === 'number' ? upper_bound : factory.upper_bound;
  if (lb > ub) return NextResponse.json({ error: 'Invalid bounds.' }, { status: 400 });

  // Delete existing children
  await prisma.child.deleteMany({ where: { factoryId: id } });

  // Generate `count` random children
  const childrenData = Array.from({ length: count }, () => ({
    value: Math.floor(Math.random() * (ub - lb + 1)) + lb,
    factoryId: id,
  }));
  await prisma.child.createMany({ data: childrenData });

  return NextResponse.json({ success: true });
}
