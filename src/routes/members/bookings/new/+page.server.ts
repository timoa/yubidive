import { prisma } from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { requireRole } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
  // Ensure only customers and admins can access this route
  const user = await requireRole(event, ['customer', 'admin']);

  const scheduleId = event.url.searchParams.get('scheduleId');
  if (!scheduleId) {
    throw redirect(303, '/members/boats');
  }

  try {
    const schedule = await prisma.boatSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        boat: true,
        bookings: true
      }
    });

    if (!schedule) {
      throw error(404, 'Schedule not found');
    }

    return {
      schedule,
      user
    };
  } catch (err) {
    throw error(500, 'Failed to load schedule');
  }
};

export const actions: Actions = {
  default: async (event) => {
    const user = await requireRole(event, ['customer', 'admin']);
    const formData = await event.request.formData();
    const scheduleId = formData.get('scheduleId') as string;

    if (!scheduleId) {
      throw error(400, 'Missing schedule ID');
    }

    try {
      const schedule = await prisma.boatSchedule.findUnique({
        where: { id: scheduleId },
        include: {
          boat: true,
          bookings: true
        }
      });

      if (!schedule) {
        throw error(404, 'Schedule not found');
      }

      // Check if there are available spots
      if (schedule.bookings.length >= schedule.boat.capacity) {
        throw error(400, 'No available spots for this schedule');
      }

      // Check if user already has a booking for this schedule
      const existingBooking = await prisma.booking.findFirst({
        where: {
          userId: user.id,
          scheduleId: scheduleId
        }
      });

      if (existingBooking) {
        throw error(400, 'You already have a booking for this schedule');
      }

      // Create the booking
      await prisma.booking.create({
        data: {
          userId: user.id,
          scheduleId: scheduleId
        }
      });

      throw redirect(303, '/members/bookings');
    } catch (err) {
      if (err instanceof Response) throw err;
      throw error(500, 'Failed to create booking');
    }
  }
};
