import { writable } from 'svelte/store';

// Get the initial locale from localStorage or default to 'en'
const initialLocale =
  typeof window !== 'undefined' ? window.localStorage.getItem('locale') || 'en' : 'en';

export const locale = writable(initialLocale);

// Subscribe to changes and update localStorage
if (typeof window !== 'undefined') {
  locale.subscribe((value) => {
    window.localStorage.setItem('locale', value);
  });
}

export function setLocale(newLocale: string) {
  locale.set(newLocale);
}
