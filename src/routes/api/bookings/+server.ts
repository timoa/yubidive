import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/bookings - Get all bookings
export async function GET({ url }: RequestEvent) {
    try {
        const userId = url.searchParams.get('userId');
        const boatId = url.searchParams.get('boatId');

        const where = {
            ...(userId && { userId }),
            ...(boatId && { boatId })
        };

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                boat: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        return json(bookings);
    } catch (error) {
        return json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

// POST /api/bookings - Create a new booking
export async function POST({ request }: RequestEvent) {
    try {
        const body = await request.json();
        const { boatId, userId, startTime, endTime } = body;

        // Check for booking conflicts
        const existingBooking = await prisma.booking.findFirst({
            where: {
                boatId,
                status: 'confirmed',
                OR: [
                    {
                        AND: [
                            { startTime: { lte: new Date(startTime) } },
                            { endTime: { gt: new Date(startTime) } }
                        ]
                    },
                    {
                        AND: [
                            { startTime: { lt: new Date(endTime) } },
                            { endTime: { gte: new Date(endTime) } }
                        ]
                    }
                ]
            }
        });

        if (existingBooking) {
            return json({ error: 'Time slot is already booked' }, { status: 400 });
        }

        const booking = await prisma.booking.create({
            data: {
                boatId,
                userId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                status: 'pending'
            },
            include: {
                boat: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return json(booking, { status: 201 });
    } catch (error) {
        return json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
