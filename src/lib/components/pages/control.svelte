<script lang="ts">
	import { selectedGuildId } from '$lib/stores';
	import type { GuildType } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility } from '$lib/utilities';
	import GuildPage from '../parts/guild-page.svelte';
	import Menu from '../parts/menu.svelte';
	import Currencies from './currencies.svelte';
	import Expel from './expel.svelte';
	import Guild from './guild.svelte';
	import Money from './money.svelte';
	import Nickname from './nickname.svelte';
	import Statements from './statements.svelte';

	let guild: GuildType;

	const wipe = async () => {
		confirmUtility('❓ Виконати вайп гільдії?', (yes) => {
			if (!yes) return;
			confirmUtility(
				'❓ Ви дійсно впевнені? Ця дія незворотньо видалить всю інформацію повязану з гільдією.',
				async (yes) => {
					if (!yes) return;
					const response = await requestUtility<{ new_guild_id: number; message: string }>('wipe', {
						guild_id: guild.id
					});
					if (response) {
						alertUtility(response.message);
						guild.id = response.new_guild_id;
						selectedGuildId.set(response.new_guild_id);
					}
				}
			);
		});
	};
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
				emoji: '⛔',
				text: 'Вигнати',
				component: Expel
			},
			{
				emoji: '🗑️',
				text: 'Вайп',
				handler: wipe
			}
		]}
	/>
</GuildPage>
