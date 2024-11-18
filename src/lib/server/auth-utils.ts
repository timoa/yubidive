import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export async function requireUser(event: RequestEvent) {
    const user = event.locals.user;
    if (!user) {
        throw redirect(303, '/auth/signin');
    }
    return user;
}

export async function requireAdmin(event: RequestEvent) {
    const user = await requireUser(event);
    if (user.role !== 'admin') {
        throw redirect(303, '/');
    }
    return user;
}

export async function requireCustomer(event: RequestEvent) {
    const user = await requireUser(event);
    if (user.role !== 'customer') {
        throw redirect(303, '/');
    }
    return user;
}

export async function requireRole(event: RequestEvent, roles: string[]) {
    const user = await requireUser(event);
    if (!roles.includes(user.role)) {
        throw redirect(303, '/');
    }
    return user;
}
