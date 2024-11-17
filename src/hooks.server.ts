import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { prisma } from '$lib/prisma';

const protectedPaths = [
  { path: '/boats', role: 'customer' },
  { path: '/boats/[id]', role: 'customer' },
  { path: '/bookings', role: 'admin' }
];

const authenticationCheck: Handle = async ({ event, resolve }) => {
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
    event.locals.user = user;
  }

  return resolve(event);
};

const authorizationCheck: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  // Check if the current path needs protection
  const protection = protectedPaths.find(p => {
    if (p.path.includes('[id]')) {
      const pathParts = p.path.split('/');
      const currentParts = pathname.split('/');
      return pathParts[1] === currentParts[1];
    }
    return p.path === pathname;
  });

  if (protection) {
    if (!event.locals.user) {
      throw redirect(303, '/signin');
    }

    if (protection.role === 'admin' && event.locals.user.role !== 'admin') {
      throw redirect(303, '/');
    }
  }

  return resolve(event);
};

export const handle = sequence(authenticationCheck, authorizationCheck);
