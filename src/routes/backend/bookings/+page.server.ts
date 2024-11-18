import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';
import { requireAdmin } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
  // Ensure only admins can access this route
  await requireAdmin(event);

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        boatSchedule: {
          include: {
            boat: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      bookings
    };
  } catch (err) {
    console.error('Error loading bookings:', err);
    throw error(500, 'Error loading bookings');
  }
};

export const actions = {
  updateStatus: async (event) => {
    // Ensure only admins can update bookings
    await requireAdmin(event);

    const data = await event.request.formData();
    const bookingId = data.get('bookingId')?.toString();
    const status = data.get('status')?.toString();

    if (!bookingId || !status) {
      throw error(400, 'Missing required fields');
    }

    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          boatSchedule: {
            include: {
              boat: true
            }
          }
        }
      });

      return { booking };
    } catch (err) {
      console.error('Error updating booking:', err);
      throw error(500, 'Error updating booking');
    }
  },

  updateBooking: async (event) => {
    // Ensure only admins can update bookings
    await requireAdmin(event);

    const data = await event.request.formData();
    const bookingId = data.get('bookingId')?.toString();
    const status = data.get('status')?.toString();

    if (!bookingId || !status) {
      throw error(400, 'Missing required fields');
    }

    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          boatSchedule: {
            include: {
              boat: true
            }
          }
        }
      });

      return { booking };
    } catch (err) {
      console.error('Error updating booking:', err);
      throw error(500, 'Error updating booking');
    }
  },

  deleteBooking: async (event) => {
    // Ensure only admins can delete bookings
    await requireAdmin(event);

    const data = await event.request.formData();
    const bookingId = data.get('bookingId')?.toString();

    if (!bookingId) {
      throw error(400, 'Missing booking ID');
    }

    try {
      await prisma.booking.delete({
        where: { id: bookingId }
      });

      return { success: true };
    } catch (err) {
      console.error('Error deleting booking:', err);
      throw error(500, 'Error deleting booking');
    }
  }
};
