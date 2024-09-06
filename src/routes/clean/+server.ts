import { POCKETBASE_URL, VERCEL_CRON_SECRET } from '$env/static/private';
import PocketBase from 'pocketbase';
export async function GET(req: Request, res: Response) {
    console.log("Running from cron");
    if(req.headers.get('Authorization') !== `Bearer ${VERCEL_CRON_SECRET}`) return new Response('Unauthorized', { status: 401 });
    const pb = new PocketBase(POCKETBASE_URL);
    const games = pb.collection('games');

    const filter = new Date(Date.UTC(Date.now()) - 2 * 24 * 60 * 60 * 1000).toDateString();
    if(!games) return new Response('Database failure: Games collection is missing from database.', { status: 500 });
    const expiredGames = await games.getFullList({ filter: `created <=  ${filter}`  });
    if(expiredGames.length === 0) return new Response('No games to delete.', { status: 200 });
    expiredGames.forEach(async game => {
        await games.delete(game.id);
    });

    return new Response('Games deleted.', { status: 200 });
}