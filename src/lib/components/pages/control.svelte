<script lang="ts">
	import { guilds, pageComponent, selectedGuildId } from '$lib/stores';
	import type { GuildType } from '$lib/types';
	import { showBackButton } from '$lib/utilities';
	import { onMount } from 'svelte';
	import Hint from '../parts/hint.svelte';
	import Menu from '../parts/menu.svelte';
	import Title from '../parts/title.svelte';
	import Guild from './guild.svelte';

	onMount(() => {
		showBackButton(() => {
			pageComponent.set(Guild);
		});
	});

	let guild: GuildType;
	const find = ($guilds ?? []).find((guild) => guild.id === $selectedGuildId);

	if (find) {
		guild = find;

		if (!guild.isOwner) {
			pageComponent.set(Guild);
		}
	}
</script>

<Title text="🎛️ Керування гільдією" />

<Hint text="ℹ️ Ви знаходетеся в меню керування гільдією <b>{guild.name}</b>." />

<Menu
	buttons={[
		{
			emoji: '📄',
			text: 'Заявки'
		},
		{
			emoji: '✍🏻',
			text: 'Псевдонім'
		},
		{
			emoji: '💱',
			text: 'Валюта'
		},
		{
			emoji: '💰',
			text: 'Кошти'
		},
		{
			emoji: '🏷️',
			text: 'Ціни'
		},
		{
			emoji: '🗑️',
			text: 'Вайп'
		}
	]}
/>
