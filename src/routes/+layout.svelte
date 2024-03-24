<script>
// @ts-nocheck

	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Alias Web Game</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://discord.gg/EXqV7W8MtY"
					target="_blank"
					rel="noreferrer"
				>
					Discord
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://longph.com"
					target="_blank"
					rel="noreferrer"
				>
					Author
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/phamduylong"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<LightSwitch class="my-4 ml-auto mr-4"/>
	<!-- Page Route Content -->
	<slot />
</AppShell>
