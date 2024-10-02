<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	const emotes = [
		'＞﹏＜',
		'(っ °Д °;)っ',
		'(;´༎ຶД༎ຶ`)',
		'⊙﹏⊙∥',
		'(´。＿。｀)',
		'(；′⌒`)',
		'(。﹏。*)',
		'o(TヘTo)',
		'.·´¯`(>▂<)´¯`·.',
		'(⊙x⊙;)',
		'ಠ_ರೃ',
		'o((⊙﹏⊙))o',
		'.Σ(っ °Д °;)っ',
		'_(:з)∠)_'
	];
</script>

<svelte:head>
	<title>{$t('error_page.an_error_occurred')} D:</title>
</svelte:head>

<div class="select-none p-10">
	<h1 class="h1 my-10">
		{emotes[Math.floor(Math.random() * emotes.length)]}
		{$t('something_wrong_happened')}...
	</h1>
	<h1 class="h1 my-10">Error: {$page.error?.message}</h1>
</div>
