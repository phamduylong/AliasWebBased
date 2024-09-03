import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { POCKETBASE_URL } from '$env/static/private';
export const pb = writable<PocketBase | undefined>(undefined, (set) => {
	if (!browser) {
		return;
	}

	const pocketbaseInstance = new PocketBase(POCKETBASE_URL);

	set(pocketbaseInstance);
});
