import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yubidive.com' },
    update: {},
    create: {
      email: 'admin@yubidive.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin'
    }
  });

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Test Customer',
      password: customerPassword,
      role: 'customer'
    }
  });

  // Create boats
  const seaExplorer = await prisma.boat.upsert({
    where: { id: 'e89b9f5a-1c7a-4e3b-b0c2-8d4a7c47f175' },
    update: {},
    create: {
      id: 'e89b9f5a-1c7a-4e3b-b0c2-8d4a7c47f175',
      name: 'Sea Explorer',
      capacity: 12,
      description: 'Perfect for group dives, equipped with modern diving facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'
    }
  });

  const reefDiver = await prisma.boat.upsert({
    where: { id: 'f67d2c1b-3a8e-4d9f-9e5b-6c2a1b3d4e5f' },
    update: {},
    create: {
      id: 'f67d2c1b-3a8e-4d9f-9e5b-6c2a1b3d4e5f',
      name: 'Reef Diver',
      capacity: 8,
      description: 'Ideal for smaller groups and specialized diving experiences.',
      imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7'
    }
  });

  // Create sample bookings
  const booking1 = await prisma.booking.upsert({
    where: { id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d' },
    update: {},
    create: {
      id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
      startTime: new Date('2024-03-20T09:00:00Z'),
      endTime: new Date('2024-03-20T15:00:00Z'),
      status: 'confirmed',
      boatId: seaExplorer.id,
      userId: customer.id
    }
  });

  console.log({
    admin,
    customer,
    seaExplorer,
    reefDiver,
    booking1
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });