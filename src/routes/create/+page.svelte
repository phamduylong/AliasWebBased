<script lang="ts">
	import { FileButton, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	// @ts-nocheck
	let gameCode: string, team1: string, team2: string;
	let files: FileList;
	const toastStore = getToastStore();
	const onFileUpload = (e: Event): void => {
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
			const wordFile = parseCSV(files[0]);
			console.log(wordFile);
		}
	}
	$: allFieldsFilled = gameCode !== "" && team1 !== "" && team2 !== "" && files?.length === 1;

	const onSubmit = (e: Event) : void => {
		e.preventDefault();
		const wordFile = parseCSV(files[0]);
		console.log(wordFile);
		const data = {
			code: gameCode,
			team1: team1,
			team2: team2,
			file: files[0]
		};

	};

	const parseCSV = (file: File): string[] => {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = () => {
			const text = reader.result as string;
			if (!text) {
				const t: ToastSettings = {
					message: 'The file is empty.',
					timeout: 3000,
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
				return [];
			}
			const lines = text.split('\n');
			const words: string[] = [];
			lines.forEach((line) => {
				if(line !== "") {
					const wordsInLine = line.split(';');
					wordsInLine.forEach((word) => {
						words.push(word.replace('\r', ''));
					});
				}
			});
			console.log(words);
			return words;
		};
		return [];
	};
</script>

<svelte:head>
	<title>Create a new game</title>
</svelte:head>
<h1 class="h1 text-center"><b>Create a new game</b></h1>
<div
	class="card relative top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-4/5 lg:w-1/3 p-4 lg:p-10 lg:m-0"
>
	<label class="label my-2 w-full">
		<span class="required">Team 1</span>
		<input type="text" class="input" placeholder="Name of team 1" bind:value={team1} required />
	</label>
	<label class="label my-2 w-full">
		<span class="required">Team 2</span>
		<input type="text" class="input" placeholder="Name of team 2" bind:value={team2} required/>
	</label>
	<label class="label my-2 w-full">
		<span class="required">File of words</span>
		<input class="input" type="file" bind:files on:change={onFileUpload} required/>
	</label>

	<a href="/create" data-sveltekit-preload-data="hover" class="w-1/2 lg:w-1/4 mt-6 lg:mt-10"
		><button class="btn variant-filled w-full" disabled={!allFieldsFilled}>Create game</button></a
	>
</div>
