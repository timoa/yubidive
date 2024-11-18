import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { requireAdmin } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
  // Ensure only admins can access this route
  await requireAdmin(event);

  try {
    const [schedules, boats] = await Promise.all([
      prisma.boatSchedule.findMany({
        include: {
          boat: true,
          bookings: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      }),
      prisma.boat.findMany()
    ]);

    return {
      schedules,
      boats
    };
  } catch (err) {
    throw error(500, 'Failed to load schedules');
  }
};

export const actions: Actions = {
  create: async (event) => {
    // Ensure only admins can create schedules
    await requireAdmin(event);

    const formData = await event.request.formData();
    const boatId = formData.get('boatId') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;

    if (!boatId || !date || !startTime || !endTime) {
      throw error(400, 'Missing required fields');
    }

    try {
      const dateObj = new Date(date);
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');

      const startDateTime = new Date(dateObj);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

      const endDateTime = new Date(dateObj);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

      const schedule = await prisma.boatSchedule.create({
        data: {
          boatId,
          date: dateObj,
          startTime: startDateTime,
          endTime: endDateTime
        },
        include: {
          boat: true
        }
      });

      return { success: true, schedule };
    } catch (err) {
      throw error(500, 'Failed to create schedule');
    }
  },

  edit: async (event) => {
    // Ensure only admins can edit schedules
    await requireAdmin(event);

    const formData = await event.request.formData();
    const id = formData.get('id') as string;
    const boatId = formData.get('boatId') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;

    if (!id || !boatId || !date || !startTime || !endTime) {
      throw error(400, 'Missing required fields');
    }

    try {
      const dateObj = new Date(date);
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');

      const startDateTime = new Date(dateObj);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

      const endDateTime = new Date(dateObj);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

      const schedule = await prisma.boatSchedule.update({
        where: { id },
        data: {
          boatId,
          date: dateObj,
          startTime: startDateTime,
          endTime: endDateTime
        },
        include: {
          boat: true,
          bookings: true
        }
      });

      return { success: true, schedule };
    } catch (err) {
      throw error(500, 'Failed to update schedule');
    }
  },

  delete: async (event) => {
    // Ensure only admins can delete schedules
    await requireAdmin(event);

    const formData = await event.request.formData();
    const id = formData.get('id') as string;

    if (!id) {
      throw error(400, 'Missing schedule ID');
    }

    try {
      await prisma.boatSchedule.delete({
        where: { id }
      });

      return { success: true };
    } catch (err) {
      throw error(500, 'Failed to delete schedule');
    }
  }
};
