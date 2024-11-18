import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import type { RequestEvent } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    logger.info('Starting user registration process');
    const { email, password, name } = await request.json();

    // Log input validation
    logger.debug('Validating registration input', {
      email,
      name,
      passwordLength: password?.length
    });

    // Validate input
    if (!email || !password || !name) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!name) missingFields.push('name');

      logger.warn('Missing required fields', { missingFields });
      return json(
        {
          error: 'Email, password, and name are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn('Invalid email format', { email });
      return json(
        {
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }

    // Check if password is strong enough
    if (password.length < 8) {
      logger.warn('Password too short', { passwordLength: password.length });
      return json(
        {
          error: 'Password must be at least 8 characters long',
          code: 'WEAK_PASSWORD'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    logger.debug('Checking for existing user', { email });
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      logger.warn('Email already registered', { email });
      return json(
        {
          error: 'Email already registered',
          code: 'EMAIL_EXISTS'
        },
        { status: 400 }
      );
    }

    // Hash password
    logger.debug('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    logger.debug('Creating new user', { email, name });
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

    logger.info('User created successfully', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Set session cookie
    logger.debug('Setting session cookie', { userId: user.id });
    cookies.set('session', user.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return json({ user });
  } catch (error) {
    logger.error('Sign up error', {
      error,
      stack: error instanceof Error ? error.stack : undefined
    });

    // Check for Prisma-specific errors
    if (error instanceof Error && error.name === 'PrismaClientValidationError') {
      logger.error('Prisma validation error', {
        error,
        message: error.message
      });
      return json(
        {
          error: 'Invalid user data format',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    return json(
      {
        error: 'An error occurred during sign up',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}
