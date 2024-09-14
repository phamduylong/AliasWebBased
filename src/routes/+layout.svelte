<script lang="ts">
	import '../app.postcss';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { browser } from '$app/environment';
	import { CircleHelp, Code, CircleChevronDown, Palette } from 'lucide-svelte';
	import {
		initializeStores,
		popup,
		storePopup,
		AppBar,
		LightSwitch,
		Toast,
		Modal
	} from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import { storeTheme } from '$lib/themeStore';
	import ResultModal from '$lib/components/ResultModal.svelte';
	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const modalRegistry: Record<string, ModalComponent> = {
		resultModalComponent: { ref: ResultModal }
	};

	const themes = [
		{ type: 'skeleton', name: 'Skeleton', icon: '💀' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' }
	] as const;

	// Dear future self, I am very sorry for this any type. GL dealing with it.
	const setTheme = ({ formData }: any) => {
		const theme = formData.get('theme')?.toString();
		if (theme) {
			document.body.setAttribute('data-theme', theme);
			$storeTheme = theme;
		}
	};

	// Set body `data-theme` based on current theme status
	storeTheme.subscribe(setBodyThemeAttribute);
	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storeTheme);
	}
</script>

<!-- Singleton Toast -->
<Toast />

<!-- Singleton Modal -->
<Modal components={modalRegistry}/>
<!-- App Bar -->
<AppBar>
	<svelte:fragment slot="lead">
		<a href="/"><strong class="text-xl uppercase">Alias Web Game</strong></a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Theme -->
		<div>
			<!-- trigger -->
			<button
				class="btn hover:variant-soft-primary"
				use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
			>
				<Palette class="md:!hidden" />
				<span class="hidden md:inline-block">Theme </span>
				<CircleChevronDown class="hidden md:inline-block" />
			</button>
			<!-- popup -->
			<div class="card p-4 w-60 shadow-xl z-40" data-popup="theme">
				<div class="space-y-4">
					<section class="flex justify-between items-center">
						<h6 class="h6">Mode</h6>
						<LightSwitch />
					</section>
					<hr />
					<nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
						<form action="/?/setTheme" method="POST" use:enhance={setTheme}>
							<ul>
								{#each themes as { icon, name, type }}
									<li>
										<button
											class="option w-full h-full"
											type="submit"
											name="theme"
											value={type}
											class:bg-primary-active-token={$storeTheme === type}
										>
											<span>{icon}</span>
											<span class="flex-auto text-left">{name}</span>
										</button>
									</li>
								{/each}
							</ul>
						</form>
					</nav>
				</div>
			</div>
		</div>
		<a class="btn hover:variant-soft-primary hidden md:inline-block" href="/faq">
			<span class="hidden md:inline-block">Help</span>
		</a>
		<a class="btn hover:variant-soft-primary md:hidden" href="/faq">
			<CircleHelp class="md:hidden" />
		</a>
		<a
			class="btn hover:variant-soft-primary hidden md:inline-block"
			href="https://github.com/phamduylong/AliasWebBased"
			target="_blank"
			rel="noreferrer"
		>
			<span class="hidden md:inline-block">GitHub</span>
		</a>
		<a
			href="https://github.com/phamduylong/AliasWebBased"
			target="_blank"
			rel="noreferrer"
			class="btn hover:variant-soft-primary md:hidden"><Code class="md:hidden" size={20} /></a
		>
	</svelte:fragment>
</AppBar>

<slot />
