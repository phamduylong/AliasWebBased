import type { Game } from '$lib/types';
export const GET = async ({ locals, url }): Promise<Response> => {
	const gameID = url.searchParams.get('gameId');
	const gamesCollection = locals.pocketBase.collection('games');
	const game = await gamesCollection.getFirstListItem<Game>(`game_id="${gameID}"`);
	return new Response(JSON.stringify(game), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
