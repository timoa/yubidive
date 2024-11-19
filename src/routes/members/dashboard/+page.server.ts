import { prisma } from '$lib/server/prisma';
import { requireMember } from '$lib/server/auth-utils';

export const load = async (event) => {
  const user = await requireMember(event);
  const now = new Date();

  // Get upcoming bookings for the user
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
      status: 'confirmed',
      boatSchedule: {
        startDateTime: {
          gte: now
        }
      }
    },
    include: {
      boatSchedule: {
        include: {
          boat: true
        }
      }
    },
    orderBy: {
      boatSchedule: {
        startDateTime: 'asc'
      }
    },
    take: 5
  });

  // Get available upcoming schedules
  const availableSchedules = await prisma.boatSchedule.findMany({
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
  });

  // Filter out schedules that are fully booked
  const availableDives = availableSchedules.filter(
    (schedule) => schedule.bookings.length < schedule.boat.capacity
  );

  return {
    upcomingBookings,
    availableDives
  };
};
