<script lang="ts">
	import type { GuildType } from '$lib/types';
	import GuildPage from '../parts/guild-page.svelte';
	import Menu from '../parts/menu.svelte';
	import Guild from './guild.svelte';
	import MoneyRequest from './money-request.svelte';

	let guild: GuildType;
</script>

<GuildPage
	title="⚡ Послуги гільдії"
	hint="ℹ️ Тут відображені послуги гільдії"
	backToPage={Guild}
	needNicknames={false}
	onGetGuild={(value) => {
		guild = value;
	}}
>
	<Menu
		buttons={[
			{
				emoji: '💰',
				text: 'Створити запит коштів',
				component: MoneyRequest
			},
			{
				emoji: '📋',
				text: 'Виставити рахунок'
			},
			{
				emoji: '🧾',
				text: 'Переглянути рахунки'
			},
			{
				emoji: '💱',
				text: 'Створити обмін на біржі'
			},
			{
				emoji: '🛒',
				text: 'Створити оголошення'
			}
		]}
	/>
</GuildPage>
