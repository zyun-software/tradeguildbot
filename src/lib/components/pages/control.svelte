<script lang="ts">
	import type { GuildType } from '$lib/types';
	import GuildPage from '../parts/guild-page.svelte';
	import Menu from '../parts/menu.svelte';
	import Currencies from './currencies.svelte';
	import Guild from './guild.svelte';
	import Money from './money.svelte';
	import Nickname from './nickname.svelte';
	import Statements from './statements.svelte';

	let guild: GuildType;
</script>

<GuildPage
	title="🎛️ Керування гільдією"
	hint="ℹ️ Це меню керування гільдією"
	backToPage={Guild}
	needNicknames={false}
	onGetGuild={(value) => {
		guild = value;
	}}
>
	<Menu
		buttons={[
			{
				emoji: '📄',
				text: 'Заявки',
				component: Statements
			},
			{
				emoji: '✍🏻',
				text: 'Псевдонім',
				component: Nickname
			},
			{
				emoji: '💱',
				text: 'Валюта',
				component: Currencies
			},
			{
				emoji: '💰',
				text: 'Кошти',
				component: Money
			},
			{
				emoji: '🗑️',
				text: 'Вайп'
			}
		]}
	/>
</GuildPage>
