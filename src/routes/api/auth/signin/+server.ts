import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import type { RequestEvent } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';

// Constant time comparison to prevent timing attacks
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST({ request, cookies }: RequestEvent) {
  const startTime = Date.now();
  let attemptedEmail: string | undefined;

  try {
    logger.info('Starting sign-in process');

    // Input validation
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');

      logger.warn('Missing required fields', { missingFields });
      return json(
        {
          error: 'Email and password are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    attemptedEmail = email;
    logger.debug('Attempting sign-in', { email });

    // Find user by email
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

    // Always hash the provided password even if user doesn't exist
    // This prevents timing attacks that could determine if an email exists
    const hashedPassword = user?.password || '$2a$10$K8zCG4H/UxTOHh3pNO1RTO'; // Dummy hash

    // Verify password using bcrypt
    const validPassword = await bcrypt.compare(password, hashedPassword);

    // Additional check to ensure user exists (after password hash)
    if (!user || !validPassword) {
      const endTime = Date.now();
      logger.warn('Failed sign-in attempt', {
        email,
        reason: !user ? 'user_not_found' : 'invalid_password',
        duration: endTime - startTime
      });

      // Use the same error message for both cases to prevent email enumeration
      return json(
        {
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      );
    }

    // Set session cookie with secure options
    logger.debug('Setting session cookie', { userId: user.id });
    const sessionId = user.id;
    cookies.set('session', sessionId, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    const { password: _, ...userWithoutPassword } = user;

    const endTime = Date.now();
    logger.info('Successful sign-in', {
      userId: user.id,
      email: user.email,
      role: user.role,
      duration: endTime - startTime
    });

    return json({ user: userWithoutPassword });
  } catch (error) {
    const endTime = Date.now();
    logger.error('Sign-in error', {
      error,
      attemptedEmail,
      duration: endTime - startTime,
      stack: error instanceof Error ? error.stack : undefined
    });

    return json(
      {
        error: 'An error occurred during sign in',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}
