import { derived, writable } from 'svelte/store';
import translations from './assets/translations';
import { browser } from '$app/environment';
import type { Locale } from './types';

export const locale = writable<Locale>('fi');
const locales = Object.keys(translations);

if (browser) {
	const storedOrPreferredLocale =
		(localStorage.getItem('locale') as Locale) || navigator.language.split('-')[0] || 'fi';
	localStorage.setItem('locale', storedOrPreferredLocale);
	locale.set(storedOrPreferredLocale);
}

function translate(locale: Locale, key: string, vars: Record<string, string>) {
	// Let's throw some errors if we're trying to use keys/locales that don't exist.
	// We could improve this by using Typescript and/or fallback values.

	if (!key) throw new Error('no key provided to $t()');
	if (!locales.includes(locale)) throw new Error(`no locale found for ${locale}`);
	if (!locale) throw new Error(`no translation for key "${key}"`);

	// Grab the translation from the translations object.
	let text = translations[locale][key];

	if (!text) throw new Error(`no translation found for ${locale}.${key}`);

	// Replace any passed in variables in the translation string.
	Object.keys(vars).forEach((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g');
		text = text.replace(regex, vars[k]);
	});

	return text;
}

export const t = derived(
	locale,
	($locale) =>
		(key: string, vars = {}) =>
			translate($locale, key, vars)
);
