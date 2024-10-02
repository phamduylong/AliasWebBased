import { CRON_SECRET } from '$env/static/private';
import type { Game } from '$lib/types';
export async function GET({ locals, request }) {
	try {
		if (request.headers.get('Authorization') !== `Bearer ${CRON_SECRET}`)
			return new Response('Unauthorized', { status: 401 });
		const games = locals.pocketBase.collection('games');

		// Get date 2 days ago in format 'YYYY-MM-DD HH:MM:SS'
		const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
		const ymd = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
		const hms = date.toISOString().split('T')[1].substring(0, 8); // 'HH:MM:SS'
		const filterDateString = `${ymd} ${hms}`;

		console.log(`Cron job running at ${filterDateString}`);

		if (!games)
			return new Response('Database failure: Games collection is missing from database.', {
				status: 500
			});
		// @ts-ignore
		const expiredGames = await games.getFullList<Game>({
			filter: `created <=  "${filterDateString}"`
		});
		if (expiredGames.length === 0) return new Response('No games to delete.', { status: 204 });
		for (const game of expiredGames) {
			await games.delete(game.id);
		}

		return new Response('Games deleted.', { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response((err as Error).message, { status: 500 });
	}
}
