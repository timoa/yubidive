import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const [boats, bookings, schedules, bookingsByMonth, bookingsByWeek] = await Promise.all([
    // Get all boats
    prisma.boat.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        schedules: {
          select: {
            id: true
          }
        }
      },
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

    // Get bookings by week
    prisma.$queryRaw`
      SELECT strftime('%W', "createdAt") as week, COUNT(*) as count
      FROM "Booking"
      WHERE "createdAt" >= ${sixMonthsAgo.toISOString()}
      GROUP BY strftime('%W', "createdAt")
      ORDER BY week
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

  const bookingsByWeekData = new Array(53).fill(0); // 53 weeks in a year
  // @ts-ignore - Raw query type
  bookingsByWeek.forEach((row) => {
    bookingsByWeekData[parseInt(row.week)] = Number(row.count);
  });

  return {
    stats: {
      totalBoats: boats.length,
      activeBoats: boats.filter((boat) => boat.status === 'ACTIVE').length,
      totalBookings: bookings.length,
      upcomingBookings: schedules.reduce((acc, schedule) => acc + schedule.bookings.length, 0),
      bookingsOverTime: {
        labels: processedBookingsByMonth.map((_, index) => index),
        data: processedBookingsByMonth
      },
      bookingsByWeek: {
        labels: bookingsByWeekData.map((_, index) => `Week ${index + 1}`),
        data: bookingsByWeekData
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
