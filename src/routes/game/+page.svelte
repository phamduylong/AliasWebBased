<script lang="ts">
	import { shuffleArray } from '$lib/helpers/common';
	import { ProgressRadial, getToastStore, getModalStore, popup } from '@skeletonlabs/skeleton';
	import type { ModalSettings, PopupSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import type { Game, Word } from '$lib/types';
	import { CircleChevronDown, CircleX } from 'lucide-svelte';
	import { pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	/** @type {import('./$types').PageData} */

	// REGION: Variables
	export let data: Game;
	let currWord: Word = data.words[0];
	let gameStarted: boolean = false;
	let timer: number = 60;
	let gameClockTimerInterval: number;

	// Singleton stores
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	// REGION: Functions
	const nextWord: Function = async (guessed: boolean = false): Promise<void> => {
		// current word was guessed
		if (guessed) {
			if (data.is_team1_turn) {
				data.team1_score++;
			} else {
				data.team2_score++;
			}
		}

		// Mark the current word as shown, let's not display it again later.
		for (const word of data.words) {
			if (word.word === currWord.word) {
				word.shown = true;
				break;
			}
		}
		// Putting await here will make the game wait for the database to update before showing the next word
		// Let's not do that and affect the user experience. We can update the database in the background.
		updateToDatabase();

		shuffleArray(data.words);
		currWord = data.words.filter((word) => !word.shown)[0];
		if (!currWord) {
			gameStarted = false;
			data.turn_started = false;
			clearInterval(gameClockTimerInterval);
			const toast = {
				message: $t('game_page.game_out_of_words'),
				timeout: 4000,
				background: 'variant-filled-primary'
			};
			toastStore.trigger(toast);
			setTimeout(async () => await endGame(), 5000);
		}
	};

	const startTurn = async () => {
		if (!data.words || data.words.length === 0) {
			const toast = {
				message: $t('game_page.failed_to_load_words'),
				timeout: 4000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(toast);
			return;
		}
		shuffleArray(data.words);
		currWord = data.words.filter((word) => !word.shown)[0];
		if (!currWord) {
			gameStarted = false;
			data.turn_started = false;
			clearInterval(gameClockTimerInterval);
			const toast = {
				message: $t('game_page.game_out_of_words'),
				timeout: 4000,
				background: 'variant-filled-primary'
			};
			toastStore.trigger(toast);
			setTimeout(async () => await endGame(), 5000);
			return;
		}
		gameStarted = true;
		timer = 60;
		data.turn_started = true;
		// let's await here to make sure the database is updated and other devices can't start, then we start the game on current device
		await updateToDatabase();
		gameClockTimerInterval = setInterval(async () => {
			timer--;
			if (timer === 0 && gameStarted) {
				// turn ended, update the database and switch teams
				clearInterval(gameClockTimerInterval);
				gameStarted = false;
				data.is_team1_turn = !data.is_team1_turn;
				data.turn_started = false;
				await updateToDatabase();
			}
		}, 1000);
	};

	const updateToDatabase: Function = async (): Promise<void> => {
		await fetch('/game', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	};

	const endGame: Function = async (): Promise<void> => {
		gameStarted = false;
		data.turn_started = false;
		// clear the interval if the game was ended before the timer ran out
		clearInterval(gameClockTimerInterval);
		await updateToDatabase();
		fetch(`${window.location.origin}/results?gameId=${data.game_id}`)
			.then((res) => res.json())
			.then((res) => {
				const modal: ModalSettings = {
					type: 'component',
					component: 'resultModalComponent',
					meta: res
				};
				modalStore.trigger(modal);
			})
			.catch((err) => {
				console.error(err);
				const toast: ToastSettings = {
					message: $t('game_page.failed_to_fetch_game_results', { error: err }),
					timeout: 4000,
					background: 'variant-filled-error'
				};
				toastStore.trigger(toast);
			});
	};

	// REGION: Reactive variables
	$: meter = () => {
		if (timer > 30) {
			return 'stroke-green-800';
		} else if (timer > 10) {
			return 'stroke-yellow-800';
		} else {
			return 'stroke-red-800';
		}
	};
	$: track = () => {
		if (timer > 30) {
			return 'stroke-green-800/60';
		} else if (timer > 10) {
			return 'stroke-yellow-800/60';
		} else {
			return 'stroke-red-800/60';
		}
	};

	// Real-time connection with pocketbase. Keeps the game in sync with other devices
	onMount(() => {
		if ($pb) {
			$pb.collection('games').subscribe<Game>(data.id, (realtimeData) => {
				data.is_team1_turn = realtimeData.record.is_team1_turn;
				data.turn_started = realtimeData.record.turn_started;
				data.words = realtimeData.record.words;
				// if the turn was started in this device, we don't want to update the scores to prevent flickering
				// otherwise update other idle screens with the current scores
				if (!gameStarted) {
					data.team1_score = realtimeData.record.team1_score;
					data.team2_score = realtimeData.record.team2_score;
				}
			});
		}
	});

	// Game score popup
	const scorePopUp: PopupSettings = {
		event: 'click',
		target: 'scorePopUp',
		placement: 'bottom'
	};
</script>

<svelte:head>
	<title>{$t('game_page.guess_the_word')}</title>
</svelte:head>

<!-- Score Banner/Popup & End Game Button -->
<div class="grid grid-flow-col grid-cols-3">
	<!-- Score Popup Trigger (sm) -->
	<button
		class="md:collapse btn btn-sm variant-filled w-fit flex justify-center m-6 font-bold"
		use:popup={scorePopUp}>{$t('game_page.scores')}&nbsp;<CircleChevronDown /></button
	>

	<!-- Score Popup Data (sm) -->
	<div class="card card-hover variant-soft-secondary p-2" data-popup="scorePopUp">
		<span class="w-1/2 min-w-fit max-w-1/2 text-center mx-2"
			>{$t('game_page.team')} {data.team1}: {data.team1_score}</span
		>|<span class="w-1/2 min-w-fit max-w-1/2 text-center mx-2"
			>{$t('game_page.team')} {data.team2}: {data.team2_score}</span
		>
	</div>

	<!-- Score Banner (lg - xl) -->
	<div
		class="collapse md:visible card card-hover variant-soft-secondary md:w-80 lg:w-96 min-w-fit relative left-1/2 -translate-x-1/2 flex justify-center select-none py-2 m-4 divide-x-2"
	>
		<span class="w-1/2 flex text-center justify-center items-center px-2"
			>{$t('game_page.team')} {data.team1}: {data.team1_score}</span
		>
		<span class="w-1/2 flex text-center justify-center items-center px-2"
			>{$t('game_page.team')} {data.team2}: {data.team2_score}</span
		>
	</div>

	<!-- End Game Button -->
	<div class="flex justify-end">
		<button
			class="btn btn-sm bg-red-700 w-fit flex justify-center m-6 font-bold"
			on:click={() => endGame()}
			disabled={data.turn_started}>{$t('game_page.end_game')}&nbsp;<CircleX /></button
		>
	</div>
</div>

{#if !gameStarted}
	<h1
		class="h1 my-10 text-center absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-max p-5 select-none font-bold"
	>
		{$t('game_page.team')}
		{data.is_team1_turn ? data.team1 : data.team2}
	</h1>
	<h3
		class="h3 my-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max p-5 select-none font-bold"
	>
		{$t('game_page.current_score')}: {data.is_team1_turn ? data.team1_score : data.team2_score}
	</h3>
	<button
		class="btn variant-filled top-[67.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 absolute font-bold"
		on:click={() => startTurn()}
		disabled={data.turn_started}>{$t('game_page.start_turn')}</button
	>
{:else}
	<h3 class="h3 mt-5 md:mt-20 flex justify-center items-center flex-col p-5 font-bold">
		{$t('game_page.current_score')}: {data.is_team1_turn ? data.team1_score : data.team2_score}
	</h3>
	<div class="my-2 md:my-5 flex justify-center items-center flex-col">
		<ProgressRadial
			class="my-2 md:my-5 select-none"
			meter={meter()}
			track={track()}
			strokeLinecap="round"
			value={(timer / 60) * 100}>{timer}</ProgressRadial
			font={80}
		>
		<h1 class="h1 my-2 md:my-5 text-center flex justify-center items-center flex-col p-5 font-bold">
			{currWord ? currWord.word : ''}
		</h1>
		<div class="inline my-2 md:my-5">
			<button
				class="btn btn-sm variant-filled mx-4 !bg-red-700 !text-white"
				on:click={() => nextWord(false)}><strong>{$t('game_page.skip_word')}</strong></button
			><button
				class="btn btn-sm variant-filled mx-4 !bg-green-700 !text-white"
				on:click={() => nextWord(true)}><strong>{$t('game_page.next_word')}</strong></button
			>
		</div>
	</div>
{/if}
