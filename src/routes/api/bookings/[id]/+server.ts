import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/bookings/[id] - Get a specific booking
export async function GET({ params }: RequestEvent) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
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

    if (!booking) {
      return json({ error: 'Booking not found' }, { status: 404 });
    }

    return json(booking);
  } catch (error) {
    return json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

// PUT /api/bookings/[id] - Update a booking
export async function PUT({ params, request }: RequestEvent) {
  try {
    const body = await request.json();
    const { startTime, endTime, status } = body;

    // If updating time, check for conflicts
    if (startTime && endTime) {
      const existingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: params.id },
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
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(status && { status })
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

    return json(booking);
  } catch (error) {
    return json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] - Delete a booking
export async function DELETE({ params }: RequestEvent) {
  try {
    await prisma.booking.delete({
      where: { id: params.id }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
