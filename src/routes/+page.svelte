<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { t } from '$lib/i18n';
	const toastStore = getToastStore();
	let gameCode = '';
	$: gameCodeEmpty = gameCode === '';
	/**
	 * Check if the string is a valid HTTP URL.
	 * @param str The string to be checked
	 * @returns {boolean} true if the string is a valid HTTP URL, false otherwise
	 * @see https://stackoverflow.com/a/43467144/14126819
	 */
	const isValidHttpUrl = (str: string): boolean => {
		let url;
		try {
			url = new URL(str);
		} catch (_) {
			return false;
		}
		return url.protocol === 'http:' || url.protocol === 'https:';
	};

	let redirectUrl = '';
	// Let's account if the user enters the whole URL instead of a game code
	const gameCodeChange: Function = () => {
		if (!isValidHttpUrl(gameCode)) {
			// hopefully this is the game code alone, but I can't prevent user from doing stupid things
			redirectUrl = gameCode;
		} else if (isValidHttpUrl(gameCode)) {
			const url = new URL(gameCode);
			// I don't want users to go to external sites
			if (url.origin === window.location.origin) {
				redirectUrl = url.pathname.split('/').pop() || '';
			} else {
				redirectUrl = '';
				const toast = {
					message: $t('index_page.external_url_not_allowed'),
					timeout: 4000,
					background: 'variant-filled-error'
				};
				toastStore.trigger(toast);
				gameCode = '';
			}
		}
	};
</script>

<svelte:head>
	<title>Alias Web Game</title>
</svelte:head>
<div
	class="card card-hover relative top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-3/4 lg:w-1/4 p-4 lg:p-10 my-10 lg:m-0"
>
	<input
		type="text"
		class="input w-3/4 my-4"
		placeholder={$t('index_page.enter_game_code')}
		bind:value={gameCode}
		on:input={() => gameCodeChange()}
	/>
	<a
		href={gameCodeEmpty ? '' : `/game?gameId=${redirectUrl}`}
		data-sveltekit-preload-data="hover"
		class="w-3/4 my-4"
		><button
			class="btn variant-filled w-full"
			disabled={gameCodeEmpty}
			title={gameCodeEmpty ? $t('index_page.game_code_empty') : $t('index_page.join_game')}
			>{$t('index_page.join_game')}</button
		></a
	>
	<a href="/create" data-sveltekit-preload-data="hover" class="w-3/4 my-4"
		><button class="btn variant-filled w-full">{$t('index_page.create_game')}</button></a
	>
</div>
