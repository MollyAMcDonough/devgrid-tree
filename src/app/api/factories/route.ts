import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MIN_BOUND = -1_000_000;
const MAX_BOUND = 1_000_000;

/**
 * Helper to check if a value is an integer.
 */
function isInt(n: unknown) {
  return typeof n === 'number' && Number.isInteger(n);
}

/**
 * Helper to emit socket events to the socket server.
 */
async function emitSocketEvent(event: string, data: unknown) {
  const socketServerUrl = process.env.SOCKET_SERVER_URL || 'http://localhost:4000';
  try {
    await fetch(`${socketServerUrl}/emit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data }),
    });
  } catch (err) {
    // Log socket errors but don't block response
    console.error('Socket emit failed:', err);
  }
}

/**
 * GET /api/factories
 * Returns all factories with their children.
 */
export async function GET() {
  try {
    const factories = await prisma.factory.findMany({
      include: { children: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(factories);
  } catch (err) {
    console.error('Failed to fetch factories:', err);
    return NextResponse.json({ error: 'Failed to fetch factories.' }, { status: 500 });
  }
}

/**
 * POST /api/factories
 * Creates a new factory and its children.
 */
export async function POST(req: NextRequest) {
  try {
    const { name, lower_bound, upper_bound, children_count } = await req.json();

    // Input validation (including safe integer bounds)
    if (
      typeof name !== 'string' ||
      name.trim().length < 1 ||
      name.trim().length > 100 ||
      !isInt(lower_bound) ||
      !isInt(upper_bound) ||
      lower_bound > upper_bound ||
      lower_bound < MIN_BOUND ||
      lower_bound > MAX_BOUND ||
      upper_bound < MIN_BOUND ||
      upper_bound > MAX_BOUND ||
      !isInt(children_count) ||
      children_count < 0 ||
      children_count > 15
    ) {
      return NextResponse.json(
        {
          error: `Invalid input. Bounds must be integers between ${MIN_BOUND} and ${MAX_BOUND}, and lower ≤ upper.`,
        },
        { status: 400 }
      );
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
    await emitSocketEvent('factories-updated', factoryWithChildren);

    return NextResponse.json(factoryWithChildren, { status: 201 });
  } catch (err) {
    console.error('Factory creation failed:', err);
    return NextResponse.json({ error: 'Failed to create factory.' }, { status: 500 });
  }
}
