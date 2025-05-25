import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MIN_BOUND = -1_000_000;
const MAX_BOUND = 1_000_000;

function isInt(n: unknown) {
  return typeof n === 'number' && Number.isInteger(n);
}

// Helper to emit socket events
async function emitSocketEvent(event: string, data: unknown) {
  const socketServerUrl = process.env.SOCKET_SERVER_URL || 'http://localhost:4000';
  try {
    await fetch(`${socketServerUrl}/emit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data }),
    });
  } catch (err) {
    console.error('Socket emit failed:', err);
  }
}

// POST /api/factories/[id]/generate - Regenerate children for a factory
// @ts-expect-error: Next.js does not provide a type for context
export async function POST(req: NextRequest, context) {
  try {
    const id = Number((context as { params: { id: string } }).params.id);
    let lower_bound, upper_bound;
    try {
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

    // Bounds validation
    if (
      !isInt(lb) ||
      !isInt(ub) ||
      lb > ub ||
      lb < MIN_BOUND ||
      lb > MAX_BOUND ||
      ub < MIN_BOUND ||
      ub > MAX_BOUND
    ) {
      return NextResponse.json(
        {
          error: `Bounds must be integers between ${MIN_BOUND} and ${MAX_BOUND}, and lower ≤ upper.`,
        },
        { status: 400 }
      );
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

    // Fetch updated factory with children
    const updatedFactory = await prisma.factory.findUnique({
      where: { id },
      include: { children: true },
    });

    // Emit real-time update
    await emitSocketEvent('factories-updated', updatedFactory);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to regenerate children:', err);
    return NextResponse.json({ error: 'Failed to regenerate children.' }, { status: 500 });
  }
}
