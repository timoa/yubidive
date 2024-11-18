import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import crypto from 'crypto';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return json(
        {
          error: 'Email is required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json(
        {
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiresAt
      }
    });

    // In a real application, you would send an email here
    console.log(`Password reset link: http://localhost:5173/reset-password/${resetToken}`);

    // Always return success to prevent email enumeration
    return json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return json({ success: true }); // Still return success to prevent email enumeration
  }
}
