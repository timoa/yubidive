import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const [boats, bookings, schedules, bookingsByMonth, bookingsByDay] = await Promise.all([
    // Get all boats
    prisma.boat.findMany({
      where: {
        schedules: {
          some: {}
        }
      }
    }),

    // Get all bookings in last 6 months
    prisma.booking.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      include: {
        boatSchedule: {
          include: {
            boat: true
          }
        }
      }
    }),

    // Get upcoming schedules
    prisma.boatSchedule.findMany({
      where: {
        startDateTime: {
          gte: now
        }
      },
      include: {
        boat: true,
        bookings: true
      },
      orderBy: {
        startDateTime: 'asc'
      },
      take: 5
    }),

    // Get bookings by month
    prisma.$queryRaw`
      SELECT strftime('%m', "createdAt") as month, COUNT(*) as count
      FROM "Booking"
      WHERE "createdAt" >= ${sixMonthsAgo.toISOString()}
      GROUP BY strftime('%m', "createdAt")
      ORDER BY month
    `,

    // Get bookings by day of week
    prisma.$queryRaw`
      SELECT strftime('%w', "createdAt") as day, COUNT(*) as count
      FROM "Booking"
      WHERE "createdAt" >= ${sixMonthsAgo.toISOString()}
      GROUP BY strftime('%w', "createdAt")
      ORDER BY day
    `
  ]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const processedBookingsByMonth = new Array(12).fill(0);

  // @ts-ignore - Raw query type
  bookingsByMonth.forEach((row) => {
    processedBookingsByMonth[parseInt(row.month) - 1] = Number(row.count);
  });

  const bookingsByDayData = new Array(7).fill(0);
  // @ts-ignore - Raw query type
  bookingsByDay.forEach((row) => {
    bookingsByDayData[parseInt(row.day)] = Number(row.count);
  });

  return {
    stats: {
      totalBoats: boats.length,
      activeBoats: boats.length,
      totalBookings: bookings.length,
      upcomingBookings: schedules.reduce((acc, schedule) => acc + schedule.bookings.length, 0),
      bookingsOverTime: {
        labels: Array.from({ length: 12 }, (_, i) => i),
        data: processedBookingsByMonth
      },
      bookingsByDay: {
        labels: Array.from({ length: 7 }, (_, i) => i),
        data: bookingsByDayData
      },
      upcomingSchedules: schedules.map((schedule) => ({
        id: schedule.id,
        title: schedule.boat.name,
        datetime: schedule.startDateTime.toLocaleString(),
        bookingCount: schedule.bookings.length
      }))
    }
  };
};
