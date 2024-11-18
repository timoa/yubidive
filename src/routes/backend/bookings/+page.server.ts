import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { requireAdmin } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
    // Ensure only admins can access this route
    await requireAdmin(event);

    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: true,
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
            bookings
        };
    } catch (err) {
        console.error('Error loading bookings:', err);
        throw error(500, 'Failed to load bookings');
    }
};

export const actions: Actions = {
    delete: async (event) => {
        // Ensure only admins can delete bookings
        await requireAdmin(event);

        const formData = await event.request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            throw error(400, 'Missing booking ID');
        }

        try {
            await prisma.booking.delete({
                where: { id }
            });

            return { success: true };
        } catch (err) {
            console.error('Error deleting booking:', err);
            throw error(500, 'Failed to delete booking');
        }
    }
};
