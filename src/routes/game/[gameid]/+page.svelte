<script lang="ts">
	import { shuffleArray } from '$lib/helpers/common';
	import { ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import type { Game, Word } from '$lib/types';
	import { page } from '$app/stores';
	import { teamTurn } from '$lib/teamsTurn';
	import type { MouseEventHandler } from 'svelte/elements';
	/** @type {import('./$types').PageData} */

	// REGION: Variables
	export let data : Game;
	data.is_team1_turn ? teamTurn.switchToTeam1() : teamTurn.switchToTeam2();
	let words: Word[] = data.words;
	let currWord: Word = data.words[0];
	let gameStarted: boolean = false;
	let timer: number = 60;
	let team1: string = data.team1,
		team2: string = data.team2;
	let team1Score: number = data.team1_score,
		team2Score: number = data.team2_score;
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
		if (guessed) {
			if ($teamTurn) {
				team1Score++;
			} else {
				team2Score++;
			}
		}
		// current word was skipped
		else {
			if ($teamTurn && team1Score > 0) {
				team1Score--;
			}
			if (!$teamTurn && team2Score > 0) {
				team2Score--;
			}
		}
	};

	const startTurn : MouseEventHandler<HTMLButtonElement> = () => {
		if (!words || words.length === 0) {
			const t = {
				message: 'Failed to load words from server.',
				timeout: 4000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
			return;
		}
		currWord = words[0];
		gameStarted = true;
		timer = 60;
		timerInterval = setInterval(() => {
			timer--;
			if (timer === 0 && gameStarted) {
				// end of 1 turn, shuffle so the last shown word is not shown again
				clearInterval(timerInterval);
				shuffleArray(words);
				const unusedWords = words.filter((word) => !word.shown);
				if (unusedWords.length) currWord = unusedWords[0];
				else {
					const t = {
						message: 'The game ran out of words. Please create a new session to play again.',
						timeout: 4000,
						background: 'variant-filled-error'
					};
					toastStore.trigger(t);
				}
				gameStarted = false;
				if ($teamTurn) {
					teamTurn.switchToTeam2();
				} else {
					teamTurn.switchToTeam1();
				}
				updateToDatabase();
			}
		}, 1000);
	};

	const updateToDatabase: Function = (): void => {
		const currState: Game = {
			game_id: $page.params.gameid,
			team1: team1,
			team2: team2,
			team1_score: team1Score,
			team2_score: team2Score,
			words: words,
			is_team1_turn: $teamTurn
		};
		fetch(`${$page.params.gameid}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(currState)
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
</script>

<svelte:head>
	<title>Guess the word</title>
</svelte:head>
	{#if !gameStarted}
		<h1 class="h1 my-10 text-center absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-max p-5">
			<b class="select-none">Team {$teamTurn ? team1 : team2}</b>
		</h1>
		<h3 class="select-none h3 my-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max p-5">
			<b class="select-none">Current score: {$teamTurn ? team1Score : team2Score}</b>
		</h3>
		<button
			class="btn variant-filled top-[67.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
			on:click={startTurn}>Start turn</button
		>
	{:else}
		<h3 class="h3 my-2 md:my-5 flex justify-center items-center flex-col p-5">
			<b>Current score: {$teamTurn ? team1Score : team2Score}</b>
		</h3>
		<div class="my-4 md:my-10 flex justify-center items-center flex-col">
			<ProgressRadial
				class="my-10 select-none"
				meter={meter()}
				track={track()}
				strokeLinecap="round"
				value={(timer / 60) * 100}>{timer}</ProgressRadial
			>
			<h1 class="h1 my-4 md:my-10 text-center flex justify-center items-center flex-col p-5"><b>{currWord ? currWord.word : ''}</b></h1>
			<div class="inline my-4 md:my-10">
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