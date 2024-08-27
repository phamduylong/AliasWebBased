import { redirect, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
export const POST: RequestHandler = async ({ locals, request }) => {
    try {
        const gamesCollection = locals.pocketBase.collection("games");
        const currentGame = await gamesCollection.getListFirstItem({game_id: request.params.gameid});
        const game = await request.json();
        if (!currentGame) {
            throw error(404, "Game not found");
        }

    } catch(e) {
        throw e
    }
}