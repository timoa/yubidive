import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { requireAdmin } from '$lib/server/auth-utils';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async (event) => {
  await requireAdmin(event);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bookings: {
        where: {
          boatSchedule: {
            startDateTime: {
              gte: new Date()
            }
          },
          status: {
            not: 'cancelled'
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return {
    users: users.map((user) => ({
      ...user,
      role: user.role.toUpperCase(),
      activeBookings: user.bookings.length
    }))
  };
};

export const actions = {
  updateUser: async (event) => {
    try {
      await requireAdmin(event);

      const data = await event.request.formData();
      const userId = data.get('id') as string;
      const name = data.get('name') as string;
      const email = data.get('email') as string;
      const role = data.get('role') as 'ADMIN' | 'MEMBER';

      if (!userId || !name || !email || !role) {
        return fail(400, {
          success: false,
          message: 'Missing required fields'
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { name, email, role }
      });

      return {
        success: true,
        message: 'User updated successfully'
      };
    } catch (e) {
      console.error('Error updating user:', e);
      return fail(500, {
        success: false,
        message: 'Failed to update user'
      });
    }
  },
  createUser: async (event) => {
    try {
      await requireAdmin(event);

      const data = await event.request.formData();
      const name = data.get('name') as string;
      const email = data.get('email') as string;
      const role = data.get('role') as 'ADMIN' | 'MEMBER';
      const password = data.get('password') as string;

      console.log('Creating user with data:', { name, email, role });

      if (!name || !email || !role || !password) {
        console.error('Missing required fields:', { name, email, role, hasPassword: !!password });
        return fail(400, {
          success: false,
          message: 'Missing required fields'
        });
      }

      // Check if user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return fail(400, {
          success: false,
          message: 'User with this email already exists'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log('Password hashed successfully');

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          role,
          password: hashedPassword
        }
      });

      console.log('User created successfully:', newUser.id);

      return {
        success: true,
        message: 'User created successfully'
      };
    } catch (e) {
      console.error('Error creating user:', e);
      return fail(500, {
        success: false,
        message: 'Failed to create user'
      });
    }
  }
};
