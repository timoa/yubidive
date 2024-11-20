import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(302, '/auth/signin');
  }

  const schedule = await prisma.boatSchedule.findUnique({
    where: { id: params.id },
    include: {
      boat: true,
      bookings: true
    }
  });

  if (!schedule) {
    throw error(404, 'Schedule not found');
  }

  // Get all boats for the select dropdown
  const boats = await prisma.boat.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return {
    schedule,
    boats
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, params }) => {
    const data = await request.formData();
    const boatId = data.get('boatId')?.toString();
    const startDateTime = data.get('startDateTime')?.toString();
    const endDateTime = data.get('endDateTime')?.toString();

    if (!boatId || !startDateTime || !endDateTime) {
      throw error(400, 'All fields are required');
    }

    // Check if there are any overlapping schedules for the same boat
    const overlappingSchedules = await prisma.boatSchedule.findMany({
      where: {
        id: { not: params.id },
        boatId: boatId,
        OR: [
          {
            AND: [
              { startDateTime: { lte: new Date(startDateTime) } },
              { endDateTime: { gt: new Date(startDateTime) } }
            ]
          },
          {
            AND: [
              { startDateTime: { lt: new Date(endDateTime) } },
              { endDateTime: { gte: new Date(endDateTime) } }
            ]
          }
        ]
      }
    });

    if (overlappingSchedules.length > 0) {
      throw error(400, 'This time slot overlaps with an existing schedule');
    }

    await prisma.boatSchedule.update({
      where: { id: params.id },
      data: {
        boatId,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime)
      }
    });

    throw redirect(302, '/backend/schedules');
  }
} satisfies Actions;
