import { writable } from 'svelte/store';
import type { User } from '@prisma/client';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const user = writable<AuthUser | null>(null);

export function isAuthenticated(): boolean {
  let authenticated = false;
  user.subscribe(value => {
    authenticated = value !== null;
  })();
  return authenticated;
}

export function hasRole(requiredRole: 'customer' | 'admin'): boolean {
  let hasRequiredRole = false;
  user.subscribe(value => {
    if (value && requiredRole === 'customer') {
      hasRequiredRole = true;
    } else if (value && value.role === requiredRole) {
      hasRequiredRole = true;
    }
  })();
  return hasRequiredRole;
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: AuthError; user?: AuthUser }> {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(data.error || 'Failed to sign in', data.code || 'UNKNOWN_ERROR');
    }

    const userData: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    };

    user.set(userData);
    return { success: true, user: userData };
  } catch (err) {
    if (err instanceof AuthError) {
      return { success: false, error: err };
    }
    return { success: false, error: new AuthError('An unexpected error occurred', 'UNKNOWN_ERROR') };
  }
}

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(data.error || 'Failed to sign up', data.code || 'UNKNOWN_ERROR');
    }

    return { success: true };
  } catch (err) {
    if (err instanceof AuthError) {
      return { success: false, error: err };
    }
    return { success: false, error: new AuthError('An unexpected error occurred', 'UNKNOWN_ERROR') };
  }
}

export async function signOut(): Promise<void> {
  await fetch('/api/auth/signout', { method: 'POST' });
  user.set(null);
}
