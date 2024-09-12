<script lang="ts">
	import { page } from '$app/stores';
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

<div class="select-none p-10">
	<h1 class="h1 my-10">
		{emotes[Math.floor(Math.random() * emotes.length)]} something wrong happened...
	</h1>
	<h1 class="h1 my-10">Error: {$page.error?.message}</h1>
</div>
