<script lang="ts">
	import shuffleArray from '$lib/helpers/common';
	import { ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	/** @type {import('./$types').PageData} */

	// REGION: Variables
	export let data;
	const words: Word[] = data.words;
	let currWord = words[0];
	let gameStarted: boolean = false;
	let timer: number = 60;
	let team1Score : number = 0, team2Score : number = 0;
	let team1Turn : boolean = true;
	const toastStore = getToastStore();

	// REGION: Functions
	let timerInterval: number;
	const nextWord: Function = (guessed: boolean = false): void => {
		// Mark the current word as shown, let's not display it again later.
		currWord.shown = true;
		shuffleArray(words);
		currWord = words.filter((word) => !word.shown)[0];
		if (!currWord) {
			const t: ToastSettings = {
				message: 'The game ran out of words. Please create a new session to play again.',
				timeout: 4000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
			clearInterval(timerInterval);
			timer = 60;
		}
		// current word was guessed
		if(guessed) {
			if(team1Turn) {
				team1Score++;
			} else {
				team2Score++;
			}
		} 
		// current word was skipped
		else {
			if(team1Turn && team1Score > 0) {
				team1Score--;
			}
			if (!team1Turn && team2Score > 0) {
				team2Score--;
			}
		}
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
</script>
<svelte:head>
	<title>Guess the word</title>
</svelte:head>
<main>
	{#if !gameStarted}
		<h1 class="h1 my-10 absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<b>Team {team1Turn ? "1" : "2"}</b>
		</h1>
		<h3 class="h3 my-10 absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2">
			<b>Current score: {team1Turn ? team1Score : team2Score}</b>
		</h3>
		<button
			class="btn variant-filled top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
			on:click={() => {
				gameStarted = true;
				timer = 60;
				timerInterval = setInterval(() => {
					timer--;
					if (timer === 0 && gameStarted) {
						// end of 1 turn, shuffle so the last shown word is not shown again
						clearInterval(timerInterval);
						shuffleArray(words);
						currWord = words.filter((word) => !word.shown)[0];
						gameStarted = false;
						team1Turn = !team1Turn;
					}
				}, 1000);
			}}>Start turn</button
		>
	{:else}
		<h3 class="h3 my-10 absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2">
			<b>Current score: {team1Turn ? team1Score : team2Score}</b>
		</h3>
		<div class="my-20 flex justify-center items-center flex-col">
			<ProgressRadial
				class="my-10 select-none"
				meter={meter()}
				track={track()}
				strokeLinecap="round"
				value={(timer / 60) * 100}>{timer}</ProgressRadial
			>
			<h1 class="h1 my-10"><b>{currWord ? currWord.word : ''}</b></h1>
			<div class="inline my-10">
				<button class="btn btn-sm variant-filled mx-4" on:click={() => nextWord(false)}>Skip word</button
				><button class="btn btn-sm variant-filled mx-4" on:click={() => nextWord(true)}
					>Next word</button
				>
			</div>
		</div>
	{/if}
</main>
