import { pb } from '$lib/pocketbase';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$env/static/private';
export const handle = async ({ event, resolve }) => {
	event.locals.pocketBase = new PocketBase(POCKETBASE_URL);

	pb.set(event.locals.pocketBase);

	event.locals.pocketBase.authStore.loadFromCookie(event.request.headers.get('cookie') ?? '');

	const response = await resolve(event);

	response.headers.set(
		'set-cookie',
		event.locals.pocketBase.authStore.exportToCookie({ secure: false })
	);

	return response;
};
