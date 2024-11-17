import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
    try {
        const { token, password } = await request.json();

        // Validate input
        if (!token || !password) {
            return json({
                error: 'Token and password are required',
                code: 'MISSING_FIELDS'
            }, { status: 400 });
        }

        // Check if password is strong enough
        if (password.length < 8) {
            return json({
                error: 'Password must be at least 8 characters long',
                code: 'WEAK_PASSWORD'
            }, { status: 400 });
        }

        // Find user with valid reset token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return json({
                error: 'Invalid or expired reset token',
                code: 'INVALID_TOKEN'
            }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiresAt: null
            }
        });

        return json({ success: true });
    } catch (error) {
        console.error('Reset password error:', error);
        return json({
            error: 'An error occurred during password reset',
            code: 'SERVER_ERROR'
        }, { status: 500 });
    }
}
