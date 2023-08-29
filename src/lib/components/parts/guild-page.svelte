<script lang="ts">
	import { guilds, pageComponent, selectedGuildId } from '$lib/stores';
	import type { GuildType } from '$lib/types';
	import { requestUtility, showBackButton } from '$lib/utilities';
	import { onMount, type ComponentType } from 'svelte';
	import Hint from '../parts/hint.svelte';
	import Title from '../parts/title.svelte';

	export let backToPage: ComponentType;
	export let title: string;
	export let hint: string;
	export let needNicknames: boolean;
	export let onGetGuild: ((guild: GuildType) => void) | undefined = undefined;

	let guild: GuildType;
	const find = ($guilds ?? []).find((guild) => guild.id === $selectedGuildId);

	if (find) {
		guild = find;
	}

	let options: string[] = [];

	onMount(async () => {
		showBackButton(() => {
			pageComponent.set(backToPage);
		});

		if (onGetGuild && guild) {
			onGetGuild(guild);
		}

		if (guild && needNicknames) {
			const response = await requestUtility<string[]>('get-guild-member-nicknames', {
				guild_id: guild.id
			});

			if (response) {
				options = response;
			}
		}
	});
</script>

{#if needNicknames}
	<datalist id="nicknames">
		{#each options as value}
			<option {value} />
		{/each}
	</datalist>
{/if}

<Title text={title} />

<Hint text={hint} />

<slot />
