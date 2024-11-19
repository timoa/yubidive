import type { RequestEvent } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';

export async function requireUser(event: RequestEvent) {
  const user = event.locals.user;
  if (!user) {
    throw redirect(303, '/auth/signin');
  }
  return event.locals.user;
}

export async function requireAdmin(event: RequestEvent) {
  const user = await requireUser(event);
  if (user.role !== 'admin') {
    throw error(403, 'Unauthorized');
  }
  return user;
}

export async function requireMember(event: RequestEvent) {
  const user = await requireUser(event);
  if (user.role !== 'member') {
    throw error(403, 'Unauthorized');
  }
  return user;
}

export async function requireRole(event: RequestEvent, roles: string[]) {
  const user = await requireUser(event);
  if (!roles.includes(user.role)) {
    throw error(403, 'Unauthorized');
  }
  return user;
}
