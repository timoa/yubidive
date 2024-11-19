import { prisma } from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { requireRole } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
  // Ensure only members and admins can access this route
  const user = await requireRole(event, ['member', 'admin']);

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
      throw error(404, 'invalidSchedule');
    }

    return {
      schedule,
      user
    };
  } catch (err) {
    throw error(500, 'bookingFailed');
  }
};

export const actions: Actions = {
  default: async (event) => {
    try {
      const user = await requireRole(event, ['member', 'admin']);
      const formData = await event.request.formData();
      const scheduleId = formData.get('scheduleId') as string;

      if (!scheduleId) {
        console.error('Missing scheduleId in form data');
        throw error(400, { message: 'invalidSchedule' });
      }

      console.log('Looking up schedule:', scheduleId);
      const schedule = await prisma.boatSchedule.findUnique({
        where: { id: scheduleId },
        include: {
          boat: true,
          bookings: true
        }
      });

      if (!schedule) {
        console.error('Schedule not found:', scheduleId);
        throw error(404, { message: 'invalidSchedule' });
      }

      // Check if there are available spots
      if (schedule.bookings.length >= schedule.boat.capacity) {
        console.error('No available spots for schedule:', scheduleId);
        throw error(400, { message: 'noSpotsAvailable' });
      }

      // Check if user already has a booking for this schedule
      console.log('Checking for existing booking - userId:', user.id, 'scheduleId:', scheduleId);
      const existingBooking = await prisma.booking.findFirst({
        where: {
          userId: user.id,
          scheduleId: scheduleId
        }
      });

      if (existingBooking) {
        console.error('User already has a booking:', user.id, scheduleId);
        throw error(400, { message: 'alreadyBooked' });
      }

      // Create the booking
      console.log('Creating booking - userId:', user.id, 'scheduleId:', scheduleId);
      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          scheduleId: scheduleId,
          status: 'confirmed' // Set initial status
        }
      });

      console.log('Booking created successfully:', booking.id);
      return { success: true, bookingId: booking.id };
    } catch (err) {
      console.error('Error creating booking:', err);

      // Handle Prisma errors specifically
      if (err.code === 'P2002') {
        throw error(400, { message: 'alreadyBooked' });
      } else if (err.code === 'P2003') {
        throw error(400, { message: 'invalidSchedule' });
      } else if (err.code === 'P2025') {
        throw error(404, { message: 'invalidSchedule' });
      }

      // If it's already an HTTP error, rethrow it
      if (err.status && err.body?.message) {
        throw err;
      }

      throw error(500, { message: 'bookingFailed' });
    }
  }
};
