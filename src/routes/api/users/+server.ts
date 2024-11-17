import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/users - Get all users
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                _count: {
                    select: { bookings: true }
                }
            }
        });
        return json(users);
    } catch (error) {
        return json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST /api/users - Create a new user
export async function POST({ request }: RequestEvent) {
    try {
        const body = await request.json();
        const { email, name, role = 'customer' } = body;

        // Check if user with email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return json({ error: 'Email already registered' }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                role
            }
        });

        return json(user, { status: 201 });
    } catch (error) {
        return json({ error: 'Failed to create user' }, { status: 500 });
    }
}
