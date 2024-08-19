<script>
	// @ts-nocheck
	let gameCode = '';
	$: gameCodeEmpty = gameCode === '';
</script>
<svelte:head>
	<title>Alias Web Game</title>
</svelte:head>
<div
	class="card card-hover relative top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-3/4 lg:w-1/4 p-4 lg:p-10 my-10 lg:m-0"
>
	<input type="text" class="input w-3/4 my-4" placeholder="Enter game code" bind:value={gameCode} />
	<a
		href={gameCodeEmpty ? '' : `/game/${gameCode}`}
		data-sveltekit-preload-data="hover"
		class="w-3/4 my-4"
		><button
			class="btn variant-filled w-full"
			disabled={gameCodeEmpty}
			title={gameCodeEmpty ? "Game code is empty. Can't join." : ''}>Join a game</button
		></a
	>
	<a href="/create" data-sveltekit-preload-data="hover" class="w-3/4 my-4"
		><button class="btn variant-filled w-full">Create a new game</button></a
	>
</div>
