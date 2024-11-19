import { writable, get } from 'svelte/store';
import type { User } from '@prisma/client';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'admin';
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const user = writable<AuthUser | null>(null);
export const isLoading = writable<boolean>(false);

export function isAuthenticated(): boolean {
  return get(user) !== null;
}

export function hasRole(requiredRole: 'member' | 'admin'): boolean {
  const value = get(user);
  if (!value) return false;

  if (value && requiredRole === 'member') {
    return ['member', 'admin'].includes(value.role);
  }

  return value.role === requiredRole;
}

export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: AuthError; user?: AuthUser }> {
  try {
    isLoading.set(true);
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(data.error || 'Failed to sign in', data.code || 'UNKNOWN_ERROR');
    }

    const userData: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role.toLowerCase()
    };

    user.set(userData);
    return { success: true, user: userData };
  } catch (err) {
    if (err instanceof AuthError) {
      return { success: false, error: err };
    }
    return {
      success: false,
      error: new AuthError('An unexpected error occurred', 'UNKNOWN_ERROR')
    };
  } finally {
    isLoading.set(false);
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name })
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
    return {
      success: false,
      error: new AuthError('An unexpected error occurred', 'UNKNOWN_ERROR')
    };
  }
}

export async function signOut(): Promise<void> {
  await fetch('/api/auth/signout', { method: 'POST' });
  user.set(null);
}
