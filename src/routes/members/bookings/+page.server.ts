import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { requireMember } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
  // Ensure only members can access this route
  const user = await requireMember(event);

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
            startDateTime: 'desc'
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
    const user = await requireMember(event);
    const formData = await event.request.formData();
    const bookingId = formData.get('id') as string;

    if (!bookingId) {
      throw error(400, 'Missing booking ID');
    }

    try {
      // Get the booking to check if it belongs to the user
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          boatSchedule: true
        }
      });

      if (!booking) {
        throw error(404, 'Booking not found');
      }

      if (booking.userId !== user.id) {
        throw error(403, 'Not authorized to cancel this booking');
      }

      // Check if the schedule is in the future
      const now = new Date();
      if (booking.boatSchedule.startDateTime < now) {
        throw error(400, 'Cannot cancel past bookings');
      }

      // Update the booking status to cancelled
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled' }
      });

      return { success: true, booking: updatedBooking };
    } catch (err) {
      console.error('Error cancelling booking:', err);
      throw error(500, 'Failed to cancel booking');
    }
  }
};
