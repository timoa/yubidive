import { derived } from 'svelte/store';
import { locale } from './locale';
import en from './en';
import fr from './fr';

const translations = {
  en,
  fr
};

export const _ = derived(locale, ($locale) => {
  return (key: string) => {
    const keys = key.split('.');
    let value = translations[$locale];

    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }

    return value || key;
  };
});
