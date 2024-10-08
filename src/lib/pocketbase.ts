import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
export const pb = writable<PocketBase | undefined>(undefined, (set) => {
	if (!browser) {
		return;
	}

	const pocketbaseInstance = new PocketBase(PUBLIC_POCKETBASE_URL);

	set(pocketbaseInstance);
});
