import { error } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const boat = await prisma.boat.findUnique({
    where: { id: params.id }
  });

  if (!boat) {
    throw error(404, 'Boat not found');
  }

  const upcomingSchedules = await prisma.boatSchedule.findMany({
    where: {
      boatId: params.id,
      startDateTime: {
        gte: new Date()
      }
    },
    include: {
      bookings: true
    },
    orderBy: {
      startDateTime: 'asc'
    },
    take: 5
  });

  return {
    boat,
    upcomingSchedules
  };
};
