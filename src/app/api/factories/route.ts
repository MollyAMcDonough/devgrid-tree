import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to check for integer
function isInt(n: unknown) {
  return typeof n === 'number' && Number.isInteger(n);
}

// GET /api/factories  - List all factories (with children)
export async function GET() {
  const factories = await prisma.factory.findMany({
    include: { children: true },
    orderBy: { id: 'asc' },
  });
  return NextResponse.json(factories);
}

// POST /api/factories  - Create new factory (with required children_count)
export async function POST(req: NextRequest) {
  const { name, lower_bound, upper_bound, children_count } = await req.json();

  // Input validation
  if (
    typeof name !== 'string' ||
    name.trim().length < 1 ||
    name.trim().length > 100 ||
    !isInt(lower_bound) ||
    !isInt(upper_bound) ||
    lower_bound > upper_bound ||
    !isInt(children_count) ||
    children_count < 0 ||
    children_count > 15
  ) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }

  // Create factory
  const factory = await prisma.factory.create({
    data: { name: name.trim(), lower_bound, upper_bound, children_count },
  });

  // Generate children
  if (children_count > 0) {
    const childrenData = Array.from({ length: children_count }, () => ({
      value: Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound,
      factoryId: factory.id,
    }));
    await prisma.child.createMany({ data: childrenData });
  }

  // Return the factory with its children
  const factoryWithChildren = await prisma.factory.findUnique({
    where: { id: factory.id },
    include: { children: true },
  });

  // --- Real-time update: Notify socket server ---
  try {
    await fetch('http://localhost:4000/emit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'factories-updated',
        data: factoryWithChildren, // or just {} if you want clients to refetch
      }),
    });
  } catch (err) {
    // Optionally log error, but don't block response
    console.error('Socket emit failed:', err);
  }

  return NextResponse.json(factoryWithChildren, { status: 201 });
}
