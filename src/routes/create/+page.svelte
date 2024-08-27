<script lang="ts">
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { ActionData, PageData } from './$types';
	// @ts-nocheck
	let gameCode: string, team1: string, team2: string;
	let files: FileList;
	let words: string;
	const toastStore = getToastStore();

	/**
	 * Bit of a dirty hack to get the words into a hidden input field and into the form data to send to the server.
	 * @param e
	 */
	const onFileUpload = async (e: Event): Promise<void> => {
		const files = (e.target as HTMLInputElement).files;
		if (files) {
			if (files.length > 1) {
				const t: ToastSettings = {
					message: 'Only 1 file is allowed.',
					timeout: 3000,
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
				return;
			}
			const file = files[0];
			const fileExt = file.name.split('.').pop();
			if (fileExt !== 'csv') {
				const t: ToastSettings = {
					message: `Only csv files are allowed. You uploaded a .${fileExt} file.`,
					timeout: 4000,
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
				return;
			}
			const wordFile = await parseCSV(files[0]);
			words = JSON.stringify(wordFile);
		}
	};
	$: allFieldsFilled = gameCode !== '' && team1 !== '' && team2 !== '' && files?.length === 1;

	export let form: ActionData;
	export let data: PageData;

	/**
	 * Parse the CSV file and return the words in an array.
	 * This function is asynchronous because it reads the file.
	 * @param file
	 */
	const parseCSV = async (file: File): Promise<string[]> => {
		return new Promise<string[]>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsText(file, 'latin1');
			reader.onload = () => {
				const text = reader.result as string;
				if (!text) {
					const t: ToastSettings = {
						message: 'The file is empty.',
						timeout: 3000,
						background: 'variant-filled-error'
					};
					toastStore.trigger(t);
					reject();
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
		});
	};
</script>

<svelte:head>
	<title>Create a new game</title>
</svelte:head>
<h1 class="h1 text-center"><b>Create a new game</b></h1>
<form
	class="card relative top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-4/5 lg:w-1/3 p-4 lg:p-10 lg:m-0"
	method="POST"
>
	<label class="label my-2 w-full">
		<span class="required">Team 1</span>
		<input
			type="text"
			class="input"
			placeholder="Name of team 1"
			bind:value={team1}
			name="team-1"
			required
		/>
	</label>
	<label class="label my-2 w-full">
		<span class="required">Team 2</span>
		<input
			type="text"
			class="input"
			placeholder="Name of team 2"
			bind:value={team2}
			name="team-2"
			required
		/>
	</label>
	<label class="label my-2 w-full">
		<span class="required">File of words</span>
		<input class="input" type="file" bind:files on:change={onFileUpload} required />
	</label>

	<!-- A hack to get words to form data -->
	<input type="hidden" bind:value={words} name="words" required/>

	<button
		type="submit"
		class="btn variant-filled w-1/2 lg:w-1/4 mt-6 lg:mt-10"
		data-sveltekit-preload-data="hover"
		disabled={!allFieldsFilled}>Create game</button
	>
</form>
