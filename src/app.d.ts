/// <reference types="@sveltejs/kit" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
		}
		interface Locals {
			user: {
				id: string;
				email: string;
				name: string;
				role: 'customer' | 'admin';
			} | null;
		}
		interface PageData {
			user: {
				id: string;
				email: string;
				name: string;
				role: 'customer' | 'admin';
			} | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
