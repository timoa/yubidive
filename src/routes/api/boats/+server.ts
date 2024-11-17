import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/boats - Get all boats
export async function GET() {
    try {
        const boats = await prisma.boat.findMany({
            include: {
                _count: {
                    select: { bookings: true }
                }
            }
        });
        return json(boats);
    } catch (error) {
        return json({ error: 'Failed to fetch boats' }, { status: 500 });
    }
}

// POST /api/boats - Create a new boat
export async function POST({ request }: RequestEvent) {
    try {
        const body = await request.json();
        const { name, capacity, description, imageUrl } = body;

        const boat = await prisma.boat.create({
            data: {
                name,
                capacity,
                description,
                imageUrl
            }
        });

        return json(boat, { status: 201 });
    } catch (error) {
        return json({ error: 'Failed to create boat' }, { status: 500 });
    }
}
