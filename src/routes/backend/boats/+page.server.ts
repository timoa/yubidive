import { prisma } from '$lib/prisma';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { requireAdmin } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
  try {
    await requireAdmin(event);

    const boats = await prisma.boat.findMany({
      include: {
        schedules: {
          where: {
            startDateTime: {
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
    try {
      await requireAdmin(event);

      const data = await event.request.formData();
      const name = data.get('name')?.toString();
      const description = data.get('description')?.toString();
      const capacity = parseInt(data.get('capacity')?.toString() || '0');
      const imageUrl = data.get('imageUrl')?.toString();
      const status = data.get('status')?.toString() || 'ACTIVE';

      if (!name) {
        return fail(400, { error: 'Name is required' });
      }

      if (!capacity || capacity <= 0) {
        return fail(400, { error: 'Capacity must be a positive number' });
      }

      await prisma.boat.create({
        data: {
          name,
          description: description || '',
          capacity,
          imageUrl: imageUrl || '',
          status
        }
      });
      return { success: true };
    } catch (err) {
      console.error('Error creating boat:', err);
      if (err instanceof Error) {
        return fail(500, { error: err.message });
      }
      return fail(500, { error: 'Failed to create boat' });
    }
  },

  update: async (event) => {
    try {
      await requireAdmin(event);

      const data = await event.request.formData();
      const id = data.get('id')?.toString();
      const name = data.get('name')?.toString();
      const description = data.get('description')?.toString();
      const capacity = parseInt(data.get('capacity')?.toString() || '0');
      const imageUrl = data.get('imageUrl')?.toString();
      const status = data.get('status')?.toString();

      if (!id || !name) {
        return fail(400, { error: 'ID and name are required' });
      }

      if (!capacity || capacity <= 0) {
        return fail(400, { error: 'Capacity must be a positive number' });
      }

      await prisma.boat.update({
        where: { id },
        data: {
          name,
          description: description || '',
          capacity,
          imageUrl: imageUrl || '',
          status
        }
      });
      return { success: true };
    } catch (err) {
      console.error('Error updating boat:', err);
      if (err instanceof Error) {
        return fail(500, { error: err.message });
      }
      return fail(500, { error: 'Failed to update boat' });
    }
  },

  delete: async (event) => {
    try {
      await requireAdmin(event);

      const data = await event.request.formData();
      const id = data.get('id')?.toString();

      if (!id) {
        return fail(400, { error: 'ID is required' });
      }

      await prisma.boat.delete({
        where: { id }
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting boat:', err);
      if (err instanceof Error) {
        return fail(500, { error: err.message });
      }
      return fail(500, { error: 'Failed to delete boat' });
    }
  }
};
