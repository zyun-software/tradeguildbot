<script lang="ts">
	import { guilds, pageComponent, selectedGuildId } from '$lib/stores';
	import { hideTelegramWebAppButton } from '$lib/utilities';
	import { onMount } from 'svelte';
	import Title from '../parts/title.svelte';
	import Guild from './guild.svelte';

	onMount(() => {
		hideTelegramWebAppButton();
	});
</script>

<Title text="📜 Список доступних гільдій" />

<div class="px-2">
	{#each $guilds ?? [] as { id, name }}
		<button
			on:click={() => {
				selectedGuildId.set(id);
				pageComponent.set(Guild);
			}}
			class="w-full mb-2"
		>
			{name}
		</button>
	{/each}
</div>
