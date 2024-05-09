<script lang="ts">
	// @ts-nocheck

	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch, Toast } from '@skeletonlabs/skeleton';
	import { CircleHelp, Github } from 'lucide-svelte';
	import { initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<!-- Singleton Toast -->
<Toast />

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/"><strong class="text-xl uppercase">Alias Web Game</strong></a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm variant-ringed-surface hidden md:inline-block card-hover" href="/faq">
					FAQ
				</a>
				<a href="/faq" class="md:hidden"><i><CircleHelp size={20} /></i></a>
				<a
					class="btn btn-sm variant-ringed-surface hidden md:inline-block card-hover"
					href="https://github.com/phamduylong/AliasWebBased"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
				<a
					href="https://github.com/phamduylong/AliasWebBased"
					target="_blank"
					rel="noreferrer"
					class="md:hidden"><i><Github size={20} /></i></a
				>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<LightSwitch class="my-4 ml-auto mr-4" />
	<!-- Page Route Content -->
	<slot />
</AppShell>
