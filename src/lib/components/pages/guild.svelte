<script lang="ts">
	import { guilds, pageComponent, selectedGuildId } from '$lib/stores';
	import type { GuildType, MenuButtonType } from '$lib/types';
	import { alertUtility, requestUtility, showBackButton } from '$lib/utilities';
	import { onMount } from 'svelte';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import Hint from '../parts/hint.svelte';
	import Menu from '../parts/menu.svelte';
	import Title from '../parts/title.svelte';
	import Account from './account.svelte';
	import Api from './api.svelte';
	import Control from './control.svelte';
	import Exchange from './exchange.svelte';
	import Guilds from './guilds.svelte';
	import SearchAnAd from './search-an-ad.svelte';
	import Services from './services.svelte';

	onMount(() => {
		showBackButton(() => {
			selectedGuildId.set(null);
			pageComponent.set(Guilds);
		});
	});

	let buttons: MenuButtonType[] = [];

	let guild: GuildType;
	const find = ($guilds ?? []).find((guild) => guild.id === $selectedGuildId);

	if (find) {
		guild = find;
		if (guild.isOwner) {
			buttons.push({
				emoji: '🎛️',
				text: 'Керування',
				component: Control
			});
		}

		buttons.push(
			...[
				{
					emoji: '💳',
					text: 'Рахунок',
					component: Account
				},
				{
					emoji: '⚡',
					text: 'Послуги',
					component: Services
				},
				{
					emoji: '🛒',
					text: 'Оголошення',
					component: SearchAnAd
				},
				{
					emoji: '💱',
					text: 'Біржа',
					component: Exchange
				},
				{
					emoji: '🤖',
					text: 'API',
					component: Api
				}
			]
		);
	} else {
		selectedGuildId.set(null);
		pageComponent.set(Guilds);
	}

	const registerForm = {
		data: {
			nickname: ''
		},
		disabled: false,
		handler: async () => {
			registerForm.disabled = true;
			const response = await requestUtility<string>('registration-in-guild', {
				guild_id: guild.id,
				nickname: registerForm.data.nickname
			});
			if (response) {
				guild.nickname = registerForm.data.nickname;
				alertUtility(response);
			}
			registerForm.disabled = false;
		}
	};
</script>

<Title text={`🏛️ ${guild.name}`} />

{#if guild.isMember}
	<Hint text="👋 Вітаю вас{guild.isOwner ? ' гільдмайстре' : ''}, <b>{guild.nickname}</b>!" />

	<Menu {buttons} />
{:else if guild.nickname}
	<Hint text="ℹ️ {guild.nickname}, ваша заявка на вступ була подана гільдмайстру." />
{:else}
	<Hint
		text="ℹ️ Для того, щоб приєднатися до гільдії, вам необхідно зареєструватися. Для цього вам потрібно подати заявку на вступ."
	/>
	<Form onSubmit={registerForm.handler}>
		<Input
			id="nickname"
			name="Псевдонім"
			value={registerForm.data.nickname}
			required={true}
			onInput={(value) => (registerForm.data.nickname = value)}
		/>
		<button disabled={registerForm.disabled} class="w-full bg-green-600">Подати заявку</button>
	</Form>
{/if}
