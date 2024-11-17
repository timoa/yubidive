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

export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      user.set(data.user);
      return { success: true };
    } else {
      return {
        success: false,
        error: new AuthError(
          data.error || 'An error occurred during sign in',
          data.code || 'UNKNOWN_ERROR'
        )
      };
    }
  } catch (error) {
    return {
      success: false,
      error: new AuthError('Network error occurred', 'NETWORK_ERROR')
    };
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

    if (response.ok) {
      user.set(data.user);
      return { success: true };
    } else {
      return {
        success: false,
        error: new AuthError(
          data.error || 'An error occurred during sign up',
          data.code || 'UNKNOWN_ERROR'
        )
      };
    }
  } catch (error) {
    return {
      success: false,
      error: new AuthError('Network error occurred', 'NETWORK_ERROR')
    };
  }
}

export async function signOut(): Promise<void> {
  try {
    await fetch('/api/auth/signout', { method: 'POST' });
  } finally {
    user.set(null);
  }
}
