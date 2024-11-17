import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/users/[id] - Get a specific user
export async function GET({ params }: RequestEvent) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                bookings: {
                    include: {
                        boat: true
                    },
                    orderBy: {
                        startTime: 'desc'
                    }
                }
            }
        });

        if (!user) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        return json(user);
    } catch (error) {
        return json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

// PUT /api/users/[id] - Update a user
export async function PUT({ params, request }: RequestEvent) {
    try {
        const body = await request.json();
        const { email, name, role } = body;

        // If email is being updated, check for duplicates
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    id: { not: params.id },
                    email
                }
            });

            if (existingUser) {
                return json({ error: 'Email already registered' }, { status: 400 });
            }
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: {
                ...(email && { email }),
                ...(name && { name }),
                ...(role && { role })
            }
        });

        return json(user);
    } catch (error) {
        return json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE({ params }: RequestEvent) {
    try {
        await prisma.user.delete({
            where: { id: params.id }
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        return json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
