import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Function to create a random date between start and end
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

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
      role: 'admin',
      createdAt: new Date('2023-12-01') // Admin created on December 1st, 2023
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
      capacity: 4,
      description: 'Ideal for intimate diving experiences and reef exploration.',
      imageUrl:
        'https://images.unsplash.com/photo-1650806139441-7f48e053df1e?q=80&w=1024&auto=format&fit=crop'
    }
  });

  // Create 25 new member users with random creation dates
  const memberUsers = [];
  const userStartDate = new Date('2023-12-01');
  const now = new Date();

  for (let i = 1; i <= 25; i++) {
    const memberPassword = await bcrypt.hash('member123', 10);
    const member = await prisma.user.upsert({
      where: { email: `member${i}@example.com` },
      update: {},
      create: {
        email: `member${i}@example.com`,
        password: memberPassword,
        name: `Member User ${i}`,
        role: 'member',
        createdAt: randomDate(userStartDate, now)
      }
    });
    memberUsers.push(member);
  }

  // Create 15 past schedules (9 for Sea Explorer, 6 for Reef Diver)
  const pastSchedules = [];
  const pastStartDate = new Date('2024-01-01');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Create 9 past schedules for Sea Explorer
  for (let i = 0; i < 9; i++) {
    const startDateTime = randomDate(pastStartDate, yesterday);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 3);

    const schedule = await prisma.boatSchedule.create({
      data: {
        startDateTime,
        endDateTime,
        boatId: seaExplorer.id
      }
    });
    pastSchedules.push(schedule);
  }

  // Create 6 past schedules for Reef Diver
  for (let i = 0; i < 6; i++) {
    const startDateTime = randomDate(pastStartDate, yesterday);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 3);

    const schedule = await prisma.boatSchedule.create({
      data: {
        startDateTime,
        endDateTime,
        boatId: reefDiver.id
      }
    });
    pastSchedules.push(schedule);
  }

  // Create 10 future schedules (7 for Sea Explorer, 3 for Reef Diver)
  const futureSchedules = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const futureEndDate = new Date();
  futureEndDate.setDate(futureEndDate.getDate() + 30); // Schedules up to 30 days in the future

  // Create 7 future schedules for Sea Explorer
  for (let i = 0; i < 7; i++) {
    const startDateTime = randomDate(tomorrow, futureEndDate);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 3);

    const schedule = await prisma.boatSchedule.create({
      data: {
        startDateTime,
        endDateTime,
        boatId: seaExplorer.id
      }
    });
    futureSchedules.push(schedule);
  }

  // Create 3 future schedules for Reef Diver
  for (let i = 0; i < 3; i++) {
    const startDateTime = randomDate(tomorrow, futureEndDate);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 3);

    const schedule = await prisma.boatSchedule.create({
      data: {
        startDateTime,
        endDateTime,
        boatId: reefDiver.id
      }
    });
    futureSchedules.push(schedule);
  }

  // Create 30 bookings for past schedules
  for (let i = 0; i < 30; i++) {
    const randomUser = memberUsers[Math.floor(Math.random() * memberUsers.length)];
    const randomSchedule = pastSchedules[Math.floor(Math.random() * pastSchedules.length)];

    await prisma.booking.create({
      data: {
        status: 'confirmed',
        userId: randomUser.id,
        scheduleId: randomSchedule.id
      }
    });
  }

  // Create 15 bookings for future schedules, balanced between users
  for (let i = 0; i < 15; i++) {
    const randomUser = memberUsers[Math.floor(Math.random() * memberUsers.length)];
    const randomSchedule = futureSchedules[Math.floor(Math.random() * futureSchedules.length)];

    await prisma.booking.create({
      data: {
        status: 'confirmed',
        userId: randomUser.id,
        scheduleId: randomSchedule.id
      }
    });
  }

  console.log('Seed data created successfully!');
  console.log(`Created:
    - 25 member users with random creation dates
    - 15 past schedules (9 for Sea Explorer, 6 for Reef Diver)
    - 10 future schedules (7 for Sea Explorer, 3 for Reef Diver)
    - 30 bookings for past schedules
    - 15 bookings for future schedules`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
