import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Game } from '$lib/types';
export const load: PageServerLoad = (async ({ locals, url }) => {
	const gameId: string = url.searchParams.get('gameId') || '';
	const gamesCollection = locals.pocketBase.collection('games');
	if (!gamesCollection) {
		throw error(500, 'Database failure: Games collection is missing from database.');
	}
	return await gamesCollection.getFirstListItem<Game>(`game_id="${gameId}"`);
}) satisfies PageServerLoad;
