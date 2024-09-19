<script lang="ts">
	import { getToastStore, type ToastSettings, clipboard } from '@skeletonlabs/skeleton';
	import type { ActionData } from './$types';
	import { browser } from '$app/environment';
	export let form: ActionData;
	let gameCode: string, team1: string, team2: string;
	let files: FileList;
	let words: string;
	const toastStore = getToastStore();

	/**
	 * Bit of a dirty hack to get the words into a hidden input field and into the form data to send to the server.
	 * @param e
	 */
	const onFileUpload = async (e: Event): Promise<void> => {
		try {
			const files = (e.target as HTMLInputElement).files;
			if (files) {
				if (files.length > 1) {
					const t: ToastSettings = {
						message: 'Only 1 file is allowed.',
						timeout: 4000,
						background: 'variant-filled-error'
					};
					toastStore.trigger(t);
					return;
				}
				const file = files[0];
				const fileExt = file.name.split('.').pop();
				if (fileExt !== 'csv') {
					throw new Error(`Only .csv files are allowed. You uploaded a .${fileExt} file.`);
				}
				const wordFile = await parseCSV(files[0]);
				words = JSON.stringify(wordFile);
			}
		} catch (err) {
			const t: ToastSettings = {
				message: (err as Error).message || 'Failed to read file.',
				timeout: 4000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	};
	$: allFieldsFilled =
		gameCode !== '' &&
		team1 !== '' &&
		team2 !== '' &&
		files?.length === 1 &&
		files[0].name.endsWith('.csv') &&
		files[0].size > 0;

	/**
	 * Parse the CSV file and return the words in an array.
	 * This function is asynchronous because it reads the file.
	 * @param file
	 * @throws Error if the file is empty
	 */
	const parseCSV = async (file: File): Promise<string[]> => {
		return new Promise<string[]>((resolve, reject) => {
			try {
				const reader = new FileReader();
				reader.readAsText(file, 'latin1');
				reader.onload = () => {
					const text = reader.result as string;
					if (!text) {
						reject(new Error('File is empty'));
					}
					const lines = text.split('\n');
					const words: string[] = [];
					lines.forEach((line) => {
						if (line !== '') {
							const wordsInLine = line.split(';');
							wordsInLine.forEach((word) => {
								words.push(word.replace('\r', ''));
							});
						}
					});
					resolve(words);
				};
			} catch (err) {
				reject(err);
			}
		});
	};
</script>

<svelte:head>
	<title>Create a new game</title>
</svelte:head>

{#if form?.success}
<h1 class="h1 text-center mt-12 mx-4 md:mt-20 font-bold">Copy game URL</h1>
<h3 class="h3 text-center mt-12 mx-4 md:mt-20 font-bold">Copy and share the game code to play with friends</h3> 
<div class="w-4/5 md:w-1/2 relative top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-token card variant-soft p-4 flex items-center gap-4">
	<input class="input" type="text" readonly={true} value="{browser ? window.location.origin : ''}/game/{form?.gameId}" data-clipboard="gameCode" />
	<button use:clipboard={{ input: 'gameCode' }} class="btn variant-filled">Copy</button>
</div>
{:else}
	<h1 class="h1 text-center mt-12 md:mt-20 font-bold">Create a new game</h1>
	<form
		class="card relative top-[37.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-4/5 md:w-1/3 p-4 md:p-10 md:m-0"
		method="POST"
	>
		<label class="label my-2 w-full">
			<span class="required">Team 1</span>
			<input
				type="text"
				class="input"
				placeholder="Name of team 1 (max 16 characters)"
				bind:value={team1}
				name="team-1"
				required
				maxlength="16"
			/>
		</label>
		<label class="label my-2 w-full">
			<span class="required">Team 2</span>
			<input
				type="text"
				class="input"
				placeholder="Name of team 2 (max 16 characters)"
				bind:value={team2}
				name="team-2"
				required
				maxlength="16"
			/>
		</label>
		<label class="label my-2 w-full">
			<span class="required">File of words</span>
			<input class="input" type="file" bind:files accept=".csv" on:change={onFileUpload} required />
		</label>

		<!-- A hack to get words to form data -->
		<input type="hidden" bind:value={words} name="words" required />

		<button
			type="submit"
			class="btn variant-filled w-1/2 lg:w-1/4 mt-6 lg:mt-10 min-w-fit"
			data-sveltekit-preload-data="hover"
			disabled={!allFieldsFilled}>Create game</button
		>
	</form>
{/if}
