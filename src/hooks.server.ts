import { pb } from '$lib/pocketbase';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$env/static/private';
export const handle = async ({ event, resolve }) => {
	event.locals.pocketBase = new PocketBase(POCKETBASE_URL);

	pb.set(event.locals.pocketBase);

	event.locals.pocketBase.authStore.loadFromCookie(event.request.headers.get('cookie') ?? '');

	let theme = '';

	const cookieTheme = event.cookies.get('theme');

	if (cookieTheme) {
		theme = cookieTheme;
	} else {
		event.cookies.set('theme', 'skeleton', { path: '/' });
		theme = 'skeleton';
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});

	// Use headers.append so that it doesn't overwrite existing cookies for theme
	// See: https://github.com/remix-run/remix/issues/231
	response.headers.append(
		'set-cookie',
		event.locals.pocketBase.authStore.exportToCookie({ secure: false })
	);

	return response;
};
