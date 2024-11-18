import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import type { RequestEvent } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';

export async function PUT({ request, locals }: RequestEvent) {
  try {
    // Ensure user is authenticated
    const currentUser = locals.user;
    if (!currentUser) {
      return json(
        {
          error: 'You must be logged in to update your profile',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    logger.info('Starting profile update', { userId: currentUser.id });

    const { name, email, currentPassword, newPassword } = await request.json();

    // Validate input
    if (!name || !email) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');

      logger.warn('Missing required fields', { missingFields });
      return json(
        {
          error: 'Name and email are required',
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

    // Check if email is already taken by another user
    if (email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser && existingUser.id !== currentUser.id) {
        logger.warn('Email already taken', { email });
        return json(
          {
            error: 'Email is already registered',
            code: 'EMAIL_EXISTS'
          },
          { status: 400 }
        );
      }
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        logger.warn('Current password required for password change');
        return json(
          {
            error: 'Current password is required to change password',
            code: 'CURRENT_PASSWORD_REQUIRED'
          },
          { status: 400 }
        );
      }

      // Get user with password
      const userWithPassword = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: { password: true }
      });

      if (!userWithPassword) {
        logger.error('User not found during password verification', {
          userId: currentUser.id
        });
        return json(
          {
            error: 'User not found',
            code: 'USER_NOT_FOUND'
          },
          { status: 404 }
        );
      }

      const validPassword = await bcrypt.compare(currentPassword, userWithPassword.password);

      if (!validPassword) {
        logger.warn('Invalid current password during password change', {
          userId: currentUser.id
        });
        return json(
          {
            error: 'Current password is incorrect',
            code: 'INVALID_PASSWORD'
          },
          { status: 400 }
        );
      }
    }

    // Update user
    const updateData: any = {
      name,
      email,
      updatedAt: new Date()
    };

    if (newPassword) {
      logger.debug('Updating password', { userId: currentUser.id });
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    logger.info('Profile updated successfully', {
      userId: currentUser.id,
      email: updatedUser.email,
      role: updatedUser.role
    });

    return json({ user: updatedUser });
  } catch (error) {
    logger.error('Profile update error', {
      error,
      stack: error instanceof Error ? error.stack : undefined
    });

    return json(
      {
        error: 'An error occurred while updating your profile',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}
