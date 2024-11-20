import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(302, '/auth/signin');
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      boatSchedule: {
        include: {
          boat: true
        }
      },
      user: true
    }
  });

  if (!booking) {
    throw error(404, 'Booking not found');
  }

  // Get available boat schedules for the same boat
  const availableSchedules = await prisma.boatSchedule.findMany({
    where: {
      boatId: booking.boatSchedule.boatId,
      startDateTime: {
        gte: new Date()
      },
      NOT: {
        bookings: {
          some: {
            id: {
              not: booking.id // Exclude current booking's schedule
            }
          }
        }
      }
    },
    include: {
      boat: true
    },
    orderBy: {
      startDateTime: 'asc'
    }
  });

  return {
    booking,
    availableSchedules
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, params }) => {
    const data = await request.formData();
    const scheduleId = data.get('scheduleId')?.toString();

    if (!scheduleId) {
      throw error(400, 'Schedule ID is required');
    }

    await prisma.booking.update({
      where: { id: params.id },
      data: {
        boatScheduleId: scheduleId
      }
    });

    throw redirect(302, '/backend/bookings');
  }
} satisfies Actions;
