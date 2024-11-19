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

  // Create member user
  const memberPassword = await bcrypt.hash('member123', 10);
  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      email: 'member@example.com',
      password: memberPassword,
      name: 'John Doe',
      role: 'member'
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
      imageUrl:
        'https://images.unsplash.com/photo-1682652481320-e1448d57824a?q=80&w=1024&auto=format&fit=crop'
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
      imageUrl:
        'https://images.unsplash.com/photo-1650806139441-7f48e053df1e?q=80&w=1024&auto=format&fit=crop'
    }
  });

  // Create boat schedules
  const schedule1 = await prisma.boatSchedule.upsert({
    where: { id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d' },
    update: {},
    create: {
      id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
      startDateTime: new Date('2024-11-23T08:00:00Z'),
      endDateTime: new Date('2024-11-23T11:00:00Z'),
      boatId: seaExplorer.id
    }
  });

  const schedule2 = await prisma.boatSchedule.upsert({
    where: { id: 'b2c3d4e5-f6a1-5b2c-9d3e-4f5a6b7c8d9e' },
    update: {},
    create: {
      id: 'b2c3d4e5-f6a1-5b2c-9d3e-4f5a6b7c8d9e',
      startDateTime: new Date('2024-11-30T08:00:00Z'),
      endDateTime: new Date('2024-11-30T11:00:00Z'),
      boatId: reefDiver.id
    }
  });

  const schedule3 = await prisma.boatSchedule.upsert({
    where: { id: '49c3d4e5-f6a1-5b2c-9d3e-4f5a6b7c8d54' },
    update: {},
    create: {
      id: '49c3d4e5-f6a1-5b2c-9d3e-4f5a6b7c8d54',
      startDateTime: new Date('2024-11-30T08:00:00Z'),
      endDateTime: new Date('2024-11-30T11:00:00Z'),
      boatId: seaExplorer.id
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
      userId: member.id
    }
  });

  console.log({ admin, member, seaExplorer, reefDiver, schedule1, schedule2, schedule3, booking1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
