<script lang="ts">
	import { getToastStore, clipboard, SlideToggle } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { Clipboard, ArrowRightCircle } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import { browser } from '$app/environment';
	export let form;
	let team1: string = '',
		team2: string = '';
	let files: FileList;
	let words: string;
	const toastStore = getToastStore();
	let useDefaultWordFile = false;
	/**
	 * A bit of a dirty hack to get the words into a hidden input field and into the form data to send to the server.
	 * @param e
	 */
	const onFileUpload = async (e: Event): Promise<void> => {
		try {
			const files = (<HTMLInputElement>e.target).files;
			if (files) {
				const file = files[0];
				if (!file) {
					// In theory should never happen, but just in case
					throw new Error('No file selected');
				}
				const fileExt = file.name.split('.').pop();
				if (fileExt !== 'csv') {
					throw new Error($t('create_page.file_extension_error', { extension: fileExt }));
				}
				const wordFile = await parseCSV(files[0]);
				words = JSON.stringify(wordFile);
			}
		} catch (err) {
			const t: ToastSettings = {
				message: (<Error>err).message || $t('create_page.failed_to_read_file'),
				timeout: 4000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	};
	$: allFieldsFilled =
		team1 &&
		team1 !== '' &&
		team2 &&
		team2 !== '' &&
		(useDefaultWordFile ||
			(files && files.length === 1 && files[0].name.endsWith('.csv') && files[0].size > 0));

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
					const text = String(reader.result);
					if (!text) {
						reject(new Error($t('create_page.file_is_empty')));
					}
					const lines = text.split('\n');
					const tmpWords: string[] = [];
					lines.forEach((line) => {
						if (line !== '') {
							const wordsInLine = line.split(';');
							wordsInLine.forEach((word) => {
								tmpWords.push(word.replace('\r', ''));
							});
						}
					});
					resolve(tmpWords);
				};
				reader.onerror = () => {
					reject(new Error($t('create_page.failed_to_read_file')));
				};
			} catch (err) {
				reject(err);
			}
		});
	};

	/**
	 * @summary Fetch the default words from the server.
	 * @async
	 * @returns {Promise<void>}
	 */
	const fetchDefaultWords = async (): Promise<void> => {
		// TODO: think of a better way to do this, maybe having the file URL customizable so that modifications are easier
		await fetch('/words_version6.csv')
			.then((res) => res.blob())
			.then(async (blobData) => {
				// See https://stackoverflow.com/a/27256755/14126819
				const fileFromWords = new File([blobData], 'words_version6.csv');
				words = JSON.stringify(await parseCSV(fileFromWords));
			})
			.catch((err) => {
				const toast: ToastSettings = {
					message: (<Error>err).message || $t('create_page.failed_to_read_file'),
					timeout: 4000,
					background: 'variant-filled-error'
				};
				toastStore.trigger(toast);
			});
	};
</script>

<svelte:head>
	<title>{$t('create_page.create_a_new_game')}</title>
</svelte:head>

{#if form && form.success}
	<!-- Game was created successfully, let's show users how to share the game -->
	<h1 class="h1 text-center mt-12 mx-4 md:mt-20 font-bold">{$t('create_page.copy_game_url')}</h1>
	<h3 class="h3 text-center mt-12 mx-4 md:mt-20 font-bold">
		{$t('create_page.copy_and_share_url')}
	</h3>
	<div
		class="w-4/5 md:w-1/2 relative top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-token card variant-soft p-4 flex items-center gap-4"
		role="main"
	>
		<input
			title="Game URL"
			class="input"
			type="text"
			readonly={true}
			value="{browser ? window.location.origin : ''}/game?gameId={form?.gameId}"
			data-clipboard="gameURL"
		/>
		<button
			title={$t('create_page.copy_game_url')}
			use:clipboard={{ input: 'gameURL' }}
			on:click={() => {
				const toast = {
					message: $t('create_page.game_code_copied'),
					timeout: 4000,
					background: 'variant-filled-success'
				};
				toastStore.trigger(toast);
			}}
			class="btn variant-filled font-bold"
			>{$t('create_page.copy')}
			<Clipboard /></button
		>
	</div>
	<a
		href="/game?gameId={form.gameId}"
		class="btn variant-filled relative left-1/2 -translate-x-1/2 top-[25%]"
		role="button"
	>
		<span class="font-bold">{$t('create_page.go_to_game')}</span>
		<span><ArrowRightCircle /></span>
	</a>
{:else}
	<!-- Form to create a new game -->
	<h1 class="h1 text-center mt-12 md:mt-20 font-bold">{$t('create_page.create_a_new_game')}</h1>
	<form
		class="card relative top-[37.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-4/5 md:w-1/2 lg:w-1/3 p-4 md:p-10 md:m-0"
		method="POST"
	>
		<label class="label my-2 w-full">
			<span class="required">{$t('create_page.team_1')}</span>
			<input
				type="text"
				class="input"
				placeholder={$t('create_page.name_of_team_1_placeholder')}
				bind:value={team1}
				name="team-1"
				required
				maxlength="16"
			/>
		</label>
		<label class="label my-2 w-full">
			<span class="required">{$t('create_page.team_2')}</span>
			<input
				type="text"
				class="input"
				placeholder={$t('create_page.name_of_team_2_placeholder')}
				bind:value={team2}
				name="team-2"
				required
				maxlength="16"
			/>
		</label>
		<label class="label my-2 w-full">
			<input class="hidden" />
			<SlideToggle
				class="my-2 float-left"
				active="bg-primary-500"
				size="sm"
				name="useDefaultWords"
				bind:checked={useDefaultWordFile}
				on:change={() => {
					if (useDefaultWordFile) fetchDefaultWords();
				}}>{$t('create_page.use_default_words')}</SlideToggle
			>
		</label>
		<label class="label my-2 w-full">
			<span class={useDefaultWordFile ? '' : 'required'}>{$t('create_page.file_of_words')}</span>
			<input
				class="input"
				type="file"
				bind:files
				accept=".csv"
				on:change={(e) => onFileUpload(e)}
				required
				disabled={useDefaultWordFile}
			/>
		</label>

		<!-- A hack to get words to form data -->
		<input type="hidden" bind:value={words} name="words" required />

		<button
			type="submit"
			class="btn variant-filled w-1/2 lg:w-1/4 mt-6 lg:mt-10 min-w-fit"
			data-sveltekit-preload-data="hover"
			disabled={!allFieldsFilled}>{$t('create_page.create_game')}</button
		>
	</form>
{/if}
