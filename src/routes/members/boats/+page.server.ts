import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireCustomer } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
  // Ensure only customers can access this route
  await requireCustomer(event);

  try {
    const boats = await prisma.boat.findMany({
      include: {
        schedules: {
          where: {
            startDateTime: {
              gte: new Date()
            }
          },
          include: {
            bookings: {
              select: {
                id: true
              }
            }
          },
          orderBy: {
            startDateTime: 'asc'
          }
        }
      }
    });

    // Transform the data to include capacity information
    const boatsWithAvailability = boats.map((boat) => ({
      ...boat,
      schedules: boat.schedules.map((schedule) => ({
        ...schedule,
        availableSpots: boat.capacity - schedule.bookings.length
      }))
    }));

    return {
      boats: boatsWithAvailability
    };
  } catch (err) {
    console.error('Error loading boats:', err);
    throw error(500, 'Failed to load boats');
  }
};
