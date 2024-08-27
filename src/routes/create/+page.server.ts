import { redirect, error } from '@sveltejs/kit';
import type {PageServerLoad} from './$types';
import { randomUUID } from 'crypto';
export const load = (async () => {
    return {team1: "", team2: "", words: ""};
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ locals, request }) => {
        const gameId = randomUUID();
        const formData = await request.formData();
        try {
            let words = JSON.parse(formData.get("words") as string);
            for(let i = 0; i < words.length; i++) {
                words[i] = {word: words[i], shown: false};
            }
            const newGame = {
                game_id: gameId,
                team1: formData.get("team-1"),
                team2: formData.get("team-2"),
                team1_score: 0,
                team2_score: 0,
                words: words,
            }
            const gamesCollection = locals.pocketBase.collection("games");
            await gamesCollection.create(newGame);
        } catch (e) {
            throw error(500, (e as Error).toString());
        }
        throw redirect(303, `/game/${gameId}`);
    }
}