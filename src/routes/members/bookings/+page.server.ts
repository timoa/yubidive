import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { requireCustomer } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
  // Ensure only customers can access this route
  const user = await requireCustomer(event);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id
      },
      include: {
        boatSchedule: {
          include: {
            boat: true
          }
        }
      },
      orderBy: [
        {
          boatSchedule: {
            date: 'desc'
          }
        },
        {
          createdAt: 'desc'
        }
      ]
    });

    return {
      bookings,
      user
    };
  } catch (err) {
    console.error('Error loading bookings:', err);
    throw error(500, 'Failed to load bookings');
  }
};

export const actions: Actions = {
  cancel: async (event) => {
    const user = await requireCustomer(event);
    const formData = await event.request.formData();
    const bookingId = formData.get('id') as string;

    if (!bookingId) {
      throw error(400, 'Missing booking ID');
    }

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          boatSchedule: true
        }
      });

      if (!booking) {
        throw error(404, 'Booking not found');
      }

      // Ensure the booking belongs to the user
      if (booking.userId !== user.id) {
        throw error(403, 'Not authorized to cancel this booking');
      }

      // Check if the schedule is in the future
      if (new Date(booking.boatSchedule.date) <= new Date()) {
        throw error(400, 'Cannot cancel past bookings');
      }

      await prisma.booking.delete({
        where: { id: bookingId }
      });

      return { success: true };
    } catch (err) {
      console.error('Error canceling booking:', err);
      if (err instanceof Response) throw err;
      throw error(500, 'Failed to cancel booking');
    }
  }
};
