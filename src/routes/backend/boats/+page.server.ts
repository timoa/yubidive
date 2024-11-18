import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { requireAdmin } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
  // Ensure only admins can access this route
  await requireAdmin(event);

  try {
    const boats = await prisma.boat.findMany({
      include: {
        schedules: {
          where: {
            date: {
              gte: new Date()
            }
          },
          include: {
            bookings: true
          }
        }
      }
    });

    return {
      boats
    };
  } catch (err) {
    console.error('Error loading boats:', err);
    throw error(500, 'Failed to load boats');
  }
};

export const actions: Actions = {
  create: async (event) => {
    await requireAdmin(event);

    const formData = await event.request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const capacity = parseInt(formData.get('capacity') as string);
    const imageUrl = formData.get('imageUrl') as string;

    if (!name || !capacity) {
      throw error(400, 'Name and capacity are required');
    }

    try {
      await prisma.boat.create({
        data: {
          name,
          description,
          capacity,
          imageUrl
        }
      });

      return { success: true };
    } catch (err) {
      console.error('Error creating boat:', err);
      throw error(500, 'Failed to create boat');
    }
  },

  update: async (event) => {
    await requireAdmin(event);

    const formData = await event.request.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const capacity = parseInt(formData.get('capacity') as string);
    const imageUrl = formData.get('imageUrl') as string;

    if (!id || !name || !capacity) {
      throw error(400, 'ID, name, and capacity are required');
    }

    try {
      await prisma.boat.update({
        where: { id },
        data: {
          name,
          description,
          capacity,
          imageUrl
        }
      });

      return { success: true };
    } catch (err) {
      console.error('Error updating boat:', err);
      throw error(500, 'Failed to update boat');
    }
  },

  delete: async (event) => {
    await requireAdmin(event);

    const formData = await event.request.formData();
    const id = formData.get('id') as string;

    if (!id) {
      throw error(400, 'Boat ID is required');
    }

    try {
      await prisma.boat.delete({
        where: { id }
      });

      return { success: true };
    } catch (err) {
      console.error('Error deleting boat:', err);
      throw error(500, 'Failed to delete boat');
    }
  }
};
