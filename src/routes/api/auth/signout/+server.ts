import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ cookies }: RequestEvent) {
    cookies.delete('session', { path: '/' });
    return json({ success: true });
}
