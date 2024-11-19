import type { RequestEvent } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';

export async function requireUser(event: RequestEvent) {
  if (!event.locals.user) {
    throw redirect(303, '/auth/signin');
  }
  return event.locals.user;
}

export async function requireAdmin(event: RequestEvent) {
  const user = await requireUser(event);
  if (!user || user.role !== 'admin') {
    throw error(403, 'Unauthorized');
  }
  return user;
}

export async function requireCustomer(event: RequestEvent) {
  const user = await requireUser(event);
  if (!user || user.role !== 'customer') {
    throw error(403, 'Unauthorized');
  }
  return user;
}

export async function requireRole(event: RequestEvent, roles: string[]) {
  const user = await requireUser(event);
  if (!user || !roles.includes(user.role)) {
    throw error(403, 'Unauthorized');
  }
  return user;
}
