import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/boats/[id] - Get a specific boat
export async function GET({ params }: RequestEvent) {
  try {
    const boat = await prisma.boat.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!boat) {
      return json({ error: 'Boat not found' }, { status: 404 });
    }

    return json(boat);
  } catch (error) {
    return json({ error: 'Failed to fetch boat' }, { status: 500 });
  }
}

// PUT /api/boats/[id] - Update a boat
export async function PUT({ params, request }: RequestEvent) {
  try {
    const body = await request.json();
    const { name, capacity, description, imageUrl } = body;

    const boat = await prisma.boat.update({
      where: { id: params.id },
      data: {
        name,
        capacity,
        description,
        imageUrl
      }
    });

    return json(boat);
  } catch (error) {
    return json({ error: 'Failed to update boat' }, { status: 500 });
  }
}

// DELETE /api/boats/[id] - Delete a boat
export async function DELETE({ params }: RequestEvent) {
  try {
    await prisma.boat.delete({
      where: { id: params.id }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return json({ error: 'Failed to delete boat' }, { status: 500 });
  }
}
