import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/factories  - List all factories (with children)
export async function GET() {
  const factories = await prisma.factory.findMany({
    include: { children: true },
    orderBy: { id: 'asc' },
  });
  return NextResponse.json(factories);
}

// POST /api/factories  - Create new factory
export async function POST(req: NextRequest) {
  const { name, lower_bound, upper_bound } = await req.json();

  // Input validation
  if (
    typeof name !== 'string' ||
    name.length < 1 ||
    name.length > 100 ||
    typeof lower_bound !== 'number' ||
    typeof upper_bound !== 'number' ||
    lower_bound > upper_bound
  ) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }

  const factory = await prisma.factory.create({
    data: { name, lower_bound, upper_bound },
  });
  return NextResponse.json(factory, { status: 201 });
}
