<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { CircleX } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	const modalStore = getModalStore();
	const baseCss: string = 'flex w-1/2 justify-center h-full card';
	let result: string = '';
	let team1Css: string = baseCss,
		team2Css: string = baseCss;
	if ($modalStore[0]) {
		if ($modalStore[0].meta.team1_score > $modalStore[0].meta.team2_score) {
			team1Css += ' variant-ghost-success';
			team2Css += ' variant-ghost-error';
			result = $t('result_modal.team_x_wins', { team: $modalStore[0].meta.team1 });
		} else if ($modalStore[0].meta.team1_score < $modalStore[0].meta.team2_score) {
			team1Css += ' variant-ghost-error';
			team2Css += ' variant-ghost-success';
			result = $t('result_modal.team_x_wins', { team: $modalStore[0].meta.team2 });
		} else {
			team1Css += ' variant-ghost-surface';
			team2Css += ' variant-ghost-surface';
			result = $t('result_modal.tie_game');
		}
	}
</script>

{#if $modalStore[0]}
	<div class="card rounded-xl" role="dialog">
		<div class="w-full flex justify-between">
			<h3 class="h3 my-2 mx-4">{$t('result_modal.game_result')}: {result}</h3>
			<button class="my-2 mx-4" on:click={() => modalStore.clear()}><CircleX /></button>
		</div>
		<hr />
		<div class="flex w-full h-full divide-x-2">
			<div class={team1Css}>
				<p class="my-5 mx-2 text-center">
					{$t('result_modal.team')}
					{$modalStore[0].meta.team1}<br />{$modalStore[0].meta.team1_score}
				</p>
			</div>
			<div class={team2Css}>
				<p class="my-5 mx-2 text-center">
					{$t('result_modal.team')}
					{$modalStore[0].meta.team2}<br />{$modalStore[0].meta.team2_score}
				</p>
			</div>
		</div>
	</div>
{/if}
