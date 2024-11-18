import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async () => {
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
    create: async ({ request }) => {
        const formData = await request.formData();
        const boatId = formData.get('boatId') as string;
        const date = formData.get('date') as string;

        if (!boatId || !date) {
            throw error(400, 'Missing required fields');
        }

        try {
            const schedule = await prisma.boatSchedule.create({
                data: {
                    boatId,
                    date: new Date(date)
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

    delete: async ({ request }) => {
        const formData = await request.formData();
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
