import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { locale } from 'svelte-i18n';
import { get } from 'svelte/store';

export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
  const currentLocale = get(locale);
  const isDateFormatted = formatStr === 'PPP';
  const dateFormat = isDateFormatted
    ? currentLocale === 'fr'
      ? 'dd MMMM yyyy'
      : 'PPP'
    : formatStr;
  return format(new Date(date), dateFormat, {
    locale: currentLocale === 'fr' ? fr : undefined
  });
}

export function formatTime(date: Date | string, formatStr: string = 'HH:mm'): string {
  return format(new Date(date), formatStr);
}
