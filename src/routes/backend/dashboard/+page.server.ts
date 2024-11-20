import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const [boats, bookings, schedules, bookingsByMonth, bookingsByWeek, users] = await Promise.all([
    // Get all boats
    prisma.boat.findMany({
      where: {
        schedules: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        status: true,
        schedules: {
          select: {
            id: true,
            bookings: true
          }
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
    `,

    // Get user statistics
    prisma.user.findMany({
      include: {
        bookings: true
      }
    })
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
    processedBookingsByMonth[parseInt(row.month) - 1] = parseInt(row.count);
  });

  const processedBookingsByWeek = new Array(53).fill(0);
  // @ts-ignore - Raw query type
  bookingsByWeek.forEach((row) => {
    processedBookingsByWeek[parseInt(row.week)] = parseInt(row.count);
  });

  return {
    stats: {
      totalBoats: boats.length,
      activeBoats: boats.filter((boat) => boat.status === 'ACTIVE').length,
      totalBookings: bookings.length,
      upcomingBookings: bookings.filter(
        (booking) => new Date(booking.boatSchedule.startDateTime) > now
      ).length,
      totalUsers: users.length,
      newUsersLastMonth: users.filter((user) => new Date(user.createdAt) > oneMonthAgo).length,
      activeUsers: users.filter((user) => user.bookings.length > 0).length,
      bookingsOverTime: {
        labels: monthNames,
        data: processedBookingsByMonth
      },
      bookingsByWeek: {
        labels: processedBookingsByWeek.map((_, i) => `Week ${i + 1}`),
        data: processedBookingsByWeek
      },
      upcomingSchedules: schedules.map((schedule) => ({
        title: schedule.boat.name,
        datetime: schedule.startDateTime,
        bookingCount: schedule.bookings.length
      })),
      usersByRole: {
        labels: ['member', 'admin'],
        data: [
          users.filter((user) => user.role === 'member').length,
          users.filter((user) => user.role === 'admin').length
        ]
      },
      bookingsByBoat: {
        labels: boats.map((boat) => boat.name),
        data: boats.map((boat) =>
          boat.schedules.reduce((total, schedule) => total + schedule.bookings.length, 0)
        )
      }
    }
  };
};
