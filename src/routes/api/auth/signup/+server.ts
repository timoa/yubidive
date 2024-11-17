import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, cookies }: RequestEvent) {
    try {
        const { email, password, name } = await request.json();

        // Validate input
        if (!email || !password || !name) {
            return json({
                error: 'Email, password, and name are required',
                code: 'MISSING_FIELDS'
            }, { status: 400 });
        }

        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json({
                error: 'Invalid email format',
                code: 'INVALID_EMAIL'
            }, { status: 400 });
        }

        // Check if password is strong enough
        if (password.length < 8) {
            return json({
                error: 'Password must be at least 8 characters long',
                code: 'WEAK_PASSWORD'
            }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return json({
                error: 'Email already registered',
                code: 'EMAIL_EXISTS'
            }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'customer' // Default role for new users
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        // Set session cookie
        cookies.set('session', user.id, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return json({ user });
    } catch (error) {
        console.error('Sign up error:', error);
        return json({
            error: 'An error occurred during sign up',
            code: 'SERVER_ERROR'
        }, { status: 500 });
    }
}
