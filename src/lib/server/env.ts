import { env } from '$env/dynamic/private';
import * as dotenv from 'dotenv';

// Load environment variables from .env file for non-SvelteKit environments (e.g., seed script)
dotenv.config();

// Use SvelteKit's environment variables if available, fallback to process.env
export const ENCRYPTION_KEY = env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY must be set in environment variables');
}
