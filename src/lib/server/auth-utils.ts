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
  if (user.role !== 'ADMIN') {
    throw error(403, 'Unauthorized');
  }
  return user;
}

export async function requireMember(event: RequestEvent) {
  const user = await requireUser(event);
  if (user.role !== 'MEMBER') {
    throw error(403, 'Unauthorized');
  }
  return user;
}

export async function requireRole(event: RequestEvent, roles: string[]) {
  const user = await requireUser(event);
  const userRole = user.role.toUpperCase();
  if (!roles.map((r) => r.toUpperCase()).includes(userRole)) {
    throw error(403, 'Unauthorized');
  }
  return user;
}
