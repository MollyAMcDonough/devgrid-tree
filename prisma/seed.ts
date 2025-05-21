import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Factory with lower_bound == upper_bound
  await prisma.factory.create({
    data: {
      name: 'Equal Bounds',
      lower_bound: 50,
      upper_bound: 50,
      children_count: 2,
      children: {
        create: [{ value: 1 }, { value: 2 }],
      },
    },
  });

  // 2. Factory with zero children
  await prisma.factory.create({
    data: {
      name: 'No Children',
      lower_bound: 10,
      upper_bound: 20,
      children_count: 0,
      children: {
        create: [],
      },
    },
  });

  // 3. Factory with 15 children
  await prisma.factory.create({
    data: {
      name: 'Factory with Many Children',
      lower_bound: 5,
      upper_bound: 100,
      children_count: 15,
      children: {
        create: Array.from({ length: 15 }).map((_, i) => ({
          value: i + 1,
        })),
      },
    },
  });

  // 4. Factory with lower_bound == 0 and upper_bound == 0
  await prisma.factory.create({
    data: {
      name: 'Zero Bounds',
      lower_bound: 0,
      upper_bound: 0,
      children_count: 1,
      children: {
        create: [{ value: 0 }],
      },
    },
  });

  // 5. Factory with a name of length 1
  await prisma.factory.create({
    data: {
      name: 'Z',
      lower_bound: 7,
      upper_bound: 77,
      children_count: 1,
      children: {
        create: [{ value: 77 }],
      },
    },
  });

  // 6. A couple of normal factories for context
  for (let i = 1; i <= 3; i++) {
    await prisma.factory.create({
      data: {
        name: `Factory ${i}`,
        lower_bound: i * 10,
        upper_bound: i * 20,
        children_count: 2,
        children: {
          create: [{ value: i * 100 }, { value: i * 100 + 1 }],
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed complete!');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
