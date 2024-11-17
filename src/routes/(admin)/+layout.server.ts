import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/signin');
    }

    if (locals.user.role !== 'admin') {
        throw redirect(303, '/');
    }

    return {
        user: locals.user
    };
};
