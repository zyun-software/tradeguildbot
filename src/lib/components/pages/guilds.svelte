<script lang="ts">
	import { guildId, guilds, pageComponent, selectedGuildId } from '$lib/stores';
	import { alertUtility, hideBackButton, requestUtility } from '$lib/utilities';
	import { onMount } from 'svelte';
	import Hint from '../parts/hint.svelte';
	import Title from '../parts/title.svelte';
	import Guild from './guild.svelte';

	onMount(() => {
		hideBackButton();
	});

	let value: number = $guildId ?? 0;
	let disabled: boolean = false;
	const onChangeHandler = async () => {
		disabled = true;
		const response = await requestUtility<{ message: string }>('change-selected-guild-id', {
			guild_id: value
		});

		if (response) {
			guildId.set(value);
			alertUtility(response.message);
		}

		disabled = false;
	};
</script>

<Title text="📜 Список гільдій" />

<div class="px-4 mb-4">
	{#each $guilds ?? [] as { id, name }}
		<button
			on:click={() => {
				selectedGuildId.set(id);
				pageComponent.set(Guild);
			}}
			class="w-full"
		>
			{name}
		</button>
	{/each}
</div>

<Hint
	text="✨ Якщо вам потрібно автоматично переходити до меню гільдії, ви можете вибрати конкретну гільдію із наведеного списку."
/>
<div class="px-4">
	<select class="w-full text-center" bind:value on:change={onChangeHandler} {disabled}>
		<option value={0} selected={$guildId === 0}>Залишатися в меню списку гільдій</option>
		{#each $guilds ?? [] as { id, name }}
			<option value={id} selected={$guildId === id}>{name} </option>
		{/each}
	</select>
</div>
