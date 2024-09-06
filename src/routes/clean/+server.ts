import { POCKETBASE_URL, VERCEL_CRON_SECRET } from '$env/static/private';
import PocketBase from 'pocketbase';
export async function GET(req: Request, res: Response) {
    console.log("Running from cron");
    if(req.headers.get('Authorization') !== `Bearer ${VERCEL_CRON_SECRET}`) return new Response('Unauthorized', { status: 401 });
    const pb = new PocketBase(POCKETBASE_URL);
    const games = pb.collection('games');

    // Get date 2 days ago in format 'YYYY-MM-DD HH:MM:SS'
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const ymd = date.toISOString().split('T')[0];
    const hms = date.toISOString().split('T')[1].substring(0, 8);
    const filterDateString = `${ymd} ${hms}`;
    if(!games) return new Response('Database failure: Games collection is missing from database.', { status: 500 });
    const expiredGames = await games.getFullList({ filter: `created <=  ${filterDateString}` });
    if(expiredGames.length === 0) return new Response('No games to delete.', { status: 200 });
    expiredGames.forEach(async game => {
        await games.delete(game.id);
    });

    return new Response('Games deleted.', { status: 200 });
}