import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, cookies }: RequestEvent) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                password: true
            }
        });

        if (!user) {
            return json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Set session cookie
        cookies.set('session', user.id, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        const { password: _, ...userWithoutPassword } = user;
        return json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Sign in error:', error);
        return json({ error: 'An error occurred during sign in' }, { status: 500 });
    }
}
