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
      password: adminPassword,
      name: 'Admin User',
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
      password: customerPassword,
      name: 'Test Customer',
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
      imageUrl: 'https://images.unsplash.com/photo-1559076948-cbd206bc0b13'
    }
  });

  const reefDiver = await prisma.boat.upsert({
    where: { id: 'f67d2c1b-3a8e-4d9f-9e5b-6c2a1b3d4e5f' },
    update: {},
    create: {
      id: 'f67d2c1b-3a8e-4d9f-9e5b-6c2a1b3d4e5f',
      name: 'Reef Diver',
      capacity: 8,
      description: 'Ideal for intimate diving experiences and reef exploration.',
      imageUrl: 'https://images.unsplash.com/photo-1564352969906-8b7f46ba4b8b'
    }
  });

  // Create boat schedules
  const schedule1 = await prisma.boatSchedule.upsert({
    where: { id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d' },
    update: {},
    create: {
      id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
      date: new Date('2024-03-20'),
      startTime: new Date('2024-03-20T09:00:00Z'),
      endTime: new Date('2024-03-20T12:00:00Z'),
      boatId: seaExplorer.id
    }
  });

  const schedule2 = await prisma.boatSchedule.upsert({
    where: { id: 'b2c3d4e5-f6a1-5b2c-9d3e-4f5a6b7c8d9e' },
    update: {},
    create: {
      id: 'b2c3d4e5-f6a1-5b2c-9d3e-4f5a6b7c8d9e',
      date: new Date('2024-03-21'),
      startTime: new Date('2024-03-21T09:00:00Z'),
      endTime: new Date('2024-03-21T12:00:00Z'),
      boatId: reefDiver.id
    }
  });

  // Create a booking
  const booking1 = await prisma.booking.upsert({
    where: { id: 'c3d4e5f6-a1b2-6c3d-0e4f-5a6b7c8d9e0f' },
    update: {},
    create: {
      id: 'c3d4e5f6-a1b2-6c3d-0e4f-5a6b7c8d9e0f',
      status: 'confirmed',
      scheduleId: schedule1.id,
      userId: customer.id
    }
  });

  console.log({ admin, customer, seaExplorer, reefDiver, schedule1, schedule2, booking1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
