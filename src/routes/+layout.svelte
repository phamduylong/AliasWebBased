<script lang="ts">
	import '../app.postcss';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { browser } from '$app/environment';
	import { Code, CircleChevronDown, Palette, Globe } from 'lucide-svelte';
	import {
		initializeStores,
		popup,
		storePopup,
		AppBar,
		LightSwitch,
		Toast,
		Modal,
		Avatar
	} from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import { storeTheme } from '$lib/themeStore';
	import ResultModal from '$lib/components/ResultModal.svelte';
	import { t, locale } from '$lib/i18n';
	import finland from '$lib/assets/finland.svg';
	import uk from '$lib/assets/united-kingdom.svg';
	import sweden from '$lib/assets/sweden.svg';
	import { onMount } from 'svelte';
	import type { Locale } from '$lib/types';
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

	const languages = [
		{ localeCode: 'en', name: 'English', icon: uk },
		{ localeCode: 'fi', name: 'Suomi', icon: finland },
		{ localeCode: 'sv', name: 'Svenska', icon: sweden }
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

	onMount(() => {
		if (browser) {
			const storedLocale = <Locale>localStorage.getItem('locale');
			if (storedLocale) $locale = storedLocale;
		}
	});
</script>

<!-- Singleton Toast -->
<Toast />

<!-- Singleton Modal -->
<Modal components={modalRegistry} />
<!-- App Bar -->
<AppBar>
	<svelte:fragment slot="lead">
		<a href="/"><strong class="text-xl uppercase select-none">Alias Web Game</strong></a>
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
				<span class="hidden md:inline-block">{$t('nav.theme')}</span>
				<CircleChevronDown class="hidden md:inline-block" />
			</button>
			<!-- popup -->
			<div class="card p-4 w-60 shadow-xl z-40" data-popup="theme">
				<div class="space-y-4">
					<section class="flex justify-between items-center">
						<h6 class="h6">{$t('nav.mode')}</h6>
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

		<!-- Language -->
		<div>
			<!-- trigger -->
			<button
				class="btn hover:variant-soft-primary"
				use:popup={{ event: 'click', target: 'language', closeQuery: 'a[href]' }}
			>
				<Globe class="md:hidden" />
				<span class="hidden md:inline-block">{$t('nav.language')}</span>
				<CircleChevronDown class="hidden md:inline-block" />
			</button>
			<!-- popup -->
			<div class="card p-4 shadow-xl z-40" data-popup="language">
				<div class="space-y-4">
					<nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
						<div>
							<ul>
								{#each languages as { icon, name, localeCode }}
									<li>
										<button
											class="option w-full h-full"
											type="submit"
											name="theme"
											value={localeCode}
											on:click={() => {
												if (browser) localStorage.setItem('locale', localeCode);
												$locale = localeCode;
											}}
										>
											<span class="flex-auto text-left">{name}</span>
											<Avatar src={icon} width="w-4" />
										</button>
									</li>
								{/each}
							</ul>
						</div>
					</nav>
				</div>
			</div>
		</div>

		<!-- GitHub -->
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
