<script>
	// @ts-nocheck
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	let gameCode = '';
	$: gameCodeEmpty = gameCode === '';
	/**
	 * Check if the string is a valid HTTP URL.
	 * @param string The string to check
	 * @returns {boolean} True if the string is a valid HTTP URL, false otherwise
	 * @see https://stackoverflow.com/a/43467144/14126819
	 */
	const isValidHttpUrl = (string) => {
		let url;

		try {
			url = new URL(string);
		} catch (_) {
			return false;
		}
		return url.protocol === 'http:' || url.protocol === 'https:';
	};

	let redirectUrl = '';
	// Let's account if the user enters the whole URL instead of a game code
	$: if (gameCodeEmpty || !isValidHttpUrl(gameCode)) {
		redirectUrl = gameCode;
	} else if (isValidHttpUrl(gameCode)) {
		const url = new URL(gameCode);
		// I don't want users to go to external sites
		if (url.origin === window.location.origin) {
			redirectUrl = url.pathname.split('/').pop();
		} else {
			redirectUrl = '';
			const t = {
				message: 'External URLs are not allowed.',
				timeout: 4000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	}
</script>

<svelte:head>
	<title>Alias Web Game</title>
</svelte:head>
<div
	class="card card-hover relative top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-3/4 lg:w-1/4 p-4 lg:p-10 my-10 lg:m-0"
>
	<input type="text" class="input w-3/4 my-4" placeholder="Enter game code" bind:value={gameCode} />
	<a
		href={gameCodeEmpty ? '' : `/game/${redirectUrl}`}
		data-sveltekit-preload-data="hover"
		class="w-3/4 my-4"
		><button
			class="btn variant-filled w-full"
			disabled={gameCodeEmpty}
			title={gameCodeEmpty ? "Game code is empty. Can't join." : 'Join game'}>Join game</button
		></a
	>
	<a href="/create" data-sveltekit-preload-data="hover" class="w-3/4 my-4"
		><button class="btn variant-filled w-full">Create a new game</button></a
	>
</div>
