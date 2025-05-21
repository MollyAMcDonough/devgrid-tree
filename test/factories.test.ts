import { POST as createFactory, GET as getFactories } from '../src/app/api/factories/route';
import {
  GET as getFactory,
  PATCH as patchFactory,
  DELETE as deleteFactory,
} from '../src/app/api/factories/[id]/route';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to mock NextRequest with a JSON body
function mockRequest(body: unknown): NextRequest {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

// Helper to mock context with params
function mockContext(id: number | string) {
  return { params: { id: String(id) } };
}

// Type for returned factory objects
type Factory = {
  id: number;
  name: string;
  lower_bound: number;
  upper_bound: number;
  children_count: number;
  children: Array<{ id: number; value: number; factoryId: number }>;
};

describe('Factories API (App Router)', () => {
  let factoryId: number;
  let factoryIds: number[] = [];

  afterAll(async () => {
    // Clean up test data
    await prisma.child.deleteMany({});
    await prisma.factory.deleteMany({});
    await prisma.$disconnect();
  });

  it('should return zero factories initially', async () => {
    const res = (await getFactories()) as NextResponse;
    expect(res.status).toBe(200);
    const data = (await res.json()) as Factory[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it('should create a factory with valid data', async () => {
    const req = mockRequest({
      name: 'Test Factory',
      lower_bound: 1,
      upper_bound: 10,
      children_count: 3,
    });
    const res = (await createFactory(req)) as NextResponse;
    expect(res.status).toBe(201);
    const data = (await res.json()) as Factory;
    factoryIds.push(data.id);
    expect(data.name).toBe('Test Factory');
    expect(data.children.length).toBe(3);
    expect(data.children_count).toBe(3);
    expect(data.lower_bound).toBe(1);
    expect(data.upper_bound).toBe(10);
    factoryId = data.id;
  });

  it('should create a factory with zero children', async () => {
    const req = mockRequest({
      name: 'Test Factory - No Children',
      lower_bound: 1,
      upper_bound: 10,
      children_count: 0,
    });
    const res = (await createFactory(req)) as NextResponse;
    expect(res.status).toBe(201);
    const data = (await res.json()) as Factory;
    factoryIds.push(data.id);
    expect(data.name).toBe('Test Factory - No Children');
    expect(data.children_count).toBe(0);
    expect(data.children.length).toBe(0);
    expect(data.lower_bound).toBe(1);
    expect(data.upper_bound).toBe(10);
  });

  it('should reject invalid children_count', async () => {
    const req = mockRequest({
      name: 'Invalid Factory - Too Many Children',
      lower_bound: 1,
      upper_bound: 10,
      children_count: 20,
    });
    const res = (await createFactory(req)) as NextResponse;
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('should reject negative children_count', async () => {
    const req = mockRequest({
      name: 'Invalid Factory - Negative Children',
      lower_bound: 1,
      upper_bound: 10,
      children_count: -2,
    });
    const res = (await createFactory(req)) as NextResponse;
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('should get all factories after creation', async () => {
    const res = (await getFactories()) as NextResponse;
    expect(res.status).toBe(200);
    const data = (await res.json()) as Factory[];
    expect(Array.isArray(data)).toBe(true);
    // Check that all created factories are present
    const returnedIds = data.map((f) => f.id);
    factoryIds.forEach((id) => expect(returnedIds).toContain(id));
    expect(data.length).toBe(factoryIds.length);
  });

  it('should get a single factory by id', async () => {
    const res = (await getFactory(
      {} as unknown as NextRequest,
      mockContext(factoryId)
    )) as NextResponse;
    expect(res.status).toBe(200);
    const data = (await res.json()) as Factory;
    expect(data.id).toBe(factoryId);
    expect(data.children).toBeDefined();
  });

  it('should update factory name and bounds', async () => {
    const req = mockRequest({
      name: 'Updated Name',
      lower_bound: 2,
      upper_bound: 8,
    });
    const res = (await patchFactory(req, mockContext(factoryId))) as NextResponse;
    expect(res.status).toBe(200);
    const data = (await res.json()) as Factory;
    expect(data.name).toBe('Updated Name');
    expect(data.lower_bound).toBe(2);
    expect(data.upper_bound).toBe(8);
  });

  it('should get all factories after patch (count unchanged)', async () => {
    const res = (await getFactories()) as NextResponse;
    expect(res.status).toBe(200);
    const data = (await res.json()) as Factory[];
    expect(data.length).toBe(factoryIds.length);
  });

  it('should delete a factory', async () => {
    const res = (await deleteFactory(
      {} as unknown as NextRequest,
      mockContext(factoryId)
    )) as NextResponse;
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    // Remove from factoryIds
    factoryIds = factoryIds.filter((id) => id !== factoryId);
  });

  it('should get all factories after deletion', async () => {
    const res = (await getFactories()) as NextResponse;
    expect(res.status).toBe(200);
    const data = (await res.json()) as Factory[];
    expect(data.length).toBe(factoryIds.length);
  });
});
