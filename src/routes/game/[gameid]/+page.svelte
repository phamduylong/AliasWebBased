<script lang="ts">
	import { shuffleArray } from '$lib/helpers/common';
	import { ProgressRadial, getToastStore, getModalStore, popup } from '@skeletonlabs/skeleton';
	import type { ModalSettings, PopupSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import type { Game, Word } from '$lib/types';
	import { page } from '$app/stores';
	import type { MouseEventHandler } from 'svelte/elements';
	import { CircleChevronDown, CircleX } from 'lucide-svelte';
	import { pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	/** @type {import('./$types').PageData} */

	// REGION: Variables
	export let data: Game;
	let currWord: Word = data.words[0];
	let gameStarted: boolean = false;
	let timer: number = 60;
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	// REGION: Functions
	let timerInterval: number;
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
			await endGame();
		}
	};

	const startTurn: MouseEventHandler<HTMLButtonElement> = async () => {
		if (!data.words || data.words.length === 0) {
			const t = {
				message: 'Failed to load words from server.',
				timeout: 4000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
			return;
		}
		shuffleArray(data.words);
		currWord = data.words.filter((word) => !word.shown)[0];
		gameStarted = true;
		timer = 60;
		data.turn_started = true;
		await updateToDatabase();
		timerInterval = setInterval(async () => {
			timer--;
			if (timer === 0 && gameStarted) {
				// end of 1 turn, shuffle so the last shown word is not shown again
				clearInterval(timerInterval);
				shuffleArray(data.words);
				const unusedWords = data.words.filter((word) => !word.shown);
				if (!unusedWords.length) {
					const t = {
						message: 'The game ran out of words. Please create a new session to play again.',
						timeout: 4000,
						background: 'variant-filled-error'
					};
					toastStore.trigger(t);
					await endGame();
				}
				currWord = unusedWords[0];
				gameStarted = false;
				//Flip the turn
				data.is_team1_turn = !data.is_team1_turn;
				data.turn_started = false;
				updateToDatabase();
			}
		}, 1000);
	};

	const updateToDatabase: Function = async (): Promise<void> => {
		await fetch(`${$page.params.gameid}/`, {
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
		clearInterval(timerInterval);
		await updateToDatabase();
		fetch(`${window.location.origin}/result/${$page.params.gameid}/`)
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
					message: `Failed to fetch game result. Error: ${err}`,
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

	onMount(() => {
		if ($pb) {
			$pb.collection('games').subscribe<Game>(data.id, (gameState) => {
				data = gameState.record;
			});
		}
	});
	const scorePopUp: PopupSettings = {
		event: 'click',
		target: 'scorePopUp',
		placement: 'bottom'
	};
</script>

<svelte:head>
	<title>Guess the word</title>
</svelte:head>

<!-- End game button -->
<button class="btn btn-sm bg-red-700 m-4 float-right font-bold" on:click={() => endGame()}
	>End Game&nbsp;<CircleX /></button
>
<!-- Score Popup -->
<button
	class="md:collapse btn btn-sm variant-filled min-w-fit flex justify-center m-4 font-bold"
	use:popup={scorePopUp}>Scores&nbsp;<CircleChevronDown /></button
>
<div class="card card-hover variant-soft-secondary p-2" data-popup="scorePopUp">
	<span class="w-1/2 min-w-fit max-w-1/2 text-center mx-2"
		>Team {data.team1}: {data.team1_score}</span
	>|<span class="w-1/2 min-w-fit max-w-1/2 text-center mx-2"
		>Team {data.team2}: {data.team2_score}</span
	>
</div>
<!-- Score Banner -->
<div
	class="collapse md:visible card card-hover variant-soft-secondary w-80 min-w-fit relative left-1/2 -translate-x-1/2 flex justify-center select-none p-2"
>
	<span class="w-1/2 min-w-fit max-w-1/2 text-center">Team {data.team1}: {data.team1_score}</span>
	<p class="bold h-max text-center mx-2">|</p>
	<span class="w-1/2 min-w-fit max-w-1/2 text-center">Team {data.team2}: {data.team2_score}</span>
</div>

{#if !gameStarted}
	<h1
		class="h1 my-10 text-center absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-max p-5"
	>
		<b class="select-none">Team {data.is_team1_turn ? data.team1 : data.team2}</b>
	</h1>
	<h3
		class="select-none h3 my-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max p-5"
	>
		<b class="select-none"
			>Current score: {data.is_team1_turn ? data.team1_score : data.team2_score}</b
		>
	</h3>
	<button
		class="btn variant-filled top-[67.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 absolute font-bold"
		on:click={startTurn}
		disabled={data.turn_started}>Start turn</button
	>
{:else}
	<h3 class="h3 my-2 md:my-5 flex justify-center items-center flex-col p-5">
		<b>Current score: {data.is_team1_turn ? data.team1_score : data.team2_score}</b>
	</h3>
	<div class="my-2 md:my-5 flex justify-center items-center flex-col">
		<ProgressRadial
			class="my-2 md:my-5 select-none"
			meter={meter()}
			track={track()}
			strokeLinecap="round"
			value={(timer / 60) * 100}>{timer}</ProgressRadial
		>
		<h1 class="h1 my-2 md:my-5 text-center flex justify-center items-center flex-col p-5">
			<b>{currWord ? currWord.word : ''}</b>
		</h1>
		<div class="inline my-2 md:my-5">
			<button
				class="btn btn-sm variant-filled mx-4 !bg-red-700 !text-white"
				on:click={() => nextWord(false)}><strong>Skip word</strong></button
			><button
				class="btn btn-sm variant-filled mx-4 !bg-green-700 !text-white"
				on:click={() => nextWord(true)}><strong>Next word</strong></button
			>
		</div>
	</div>
{/if}
