import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { prisma } from '$lib/prisma';

const protectedPaths = [
  { path: '/members/boats', role: 'MEMBER' },
  { path: '/backend/schedules', role: 'ADMIN' },
  { path: '/backend/bookings', role: 'ADMIN' },
  { path: '/backend/boats', role: 'ADMIN' },
  { path: '/backend/users', role: 'ADMIN' }
];

const authenticationCheck: Handle = async ({ event, resolve }) => {
  // Don't check authentication for auth routes
  if (event.url.pathname.startsWith('/auth/')) {
    return resolve(event);
  }

  const session = event.cookies.get('session');

  if (!session) {
    event.locals.user = null;
  } else {
    const user = await prisma.user.findUnique({
      where: { id: session },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      event.cookies.delete('session', { path: '/' });
      event.locals.user = null;
    } else {
      // Ensure role is uppercase
      event.locals.user = {
        ...user,
        role: user.role.toUpperCase()
      };
    }
  }

  return resolve(event);
};

const authorizationCheck: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  // Don't check authorization for auth routes
  if (pathname.startsWith('/auth/')) {
    return resolve(event);
  }

  // Check if the current path needs protection
  const protection = protectedPaths.find((p) => {
    const pathParts = p.path.split('/');
    const currentParts = pathname.split('/');
    // Match the first two parts of the path (e.g., /members/boats)
    return pathParts[1] === currentParts[1] && pathParts[2] === currentParts[2];
  });

  if (protection) {
    if (!event.locals.user) {
      throw redirect(303, '/auth/signin');
    }

    const userRole = event.locals.user.role.toUpperCase();

    if (protection.role === 'ADMIN' && userRole !== 'ADMIN') {
      throw redirect(303, '/');
    }

    if (protection.role === 'MEMBER' && !['MEMBER', 'ADMIN'].includes(userRole)) {
      throw redirect(303, '/');
    }
  }

  return resolve(event);
};

export const handle = sequence(authenticationCheck, authorizationCheck);
