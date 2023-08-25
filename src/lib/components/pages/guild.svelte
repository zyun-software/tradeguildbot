<script lang="ts">
	import { guilds, pageComponent, selectedGuildId } from '$lib/stores';
	import type { GuildType, MenuButtonType } from '$lib/types';
	import { alertUtility, requestUtility, showTelegramWebAppButton } from '$lib/utilities';
	import { onMount } from 'svelte';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import Hint from '../parts/hint.svelte';
	import Menu from '../parts/menu.svelte';
	import Title from '../parts/title.svelte';
	import Guilds from './guilds.svelte';

	onMount(() => {
		showTelegramWebAppButton('До списку гільдій', () => {
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
				text: 'Керування'
			});
		}

		buttons.push(
			...[
				{
					emoji: '💳',
					text: 'Рахунок'
				},
				{
					emoji: '💱',
					text: 'Біржа'
				},
				{
					emoji: '📢',
					text: 'Оголошення'
				},
				{
					emoji: '⚡',
					text: 'Послуги'
				},
				{
					emoji: '🤖',
					text: 'API'
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
			const response = await requestUtility<{ message: string }>('registration-in-guild', {
				guild_id: guild.id,
				nickname: registerForm.data.nickname
			});
			if (response) {
				guild.nickname = registerForm.data.nickname;
				alertUtility(`✅ ${response.message}`);
			}
			registerForm.disabled = false;
		}
	};
</script>

<Title text={`🏛️ ${guild.name}`} />

{#if guild.isMember}
	<Hint
		text="👋 Вітаю вас{guild.isOwner
			? ' гільдмайстре'
			: ''}, <b>{guild.nickname}</b>! Ви знаходитесь в головному меню гільдії."
	/>

	<div class="px-2">
		<Menu {buttons} />
	</div>
{:else if guild.nickname}
	<Hint text="ℹ️ {guild.nickname}, ваша заявка на вступ була подана гільдмайстру." />
{:else}
	<Hint
		text="ℹ️ Для того, щоб приєднатися до гільдії, вам необхідно зареєструватися. Для цього вам потрібно подати заявку на вступ."
	/>
	<div class="px-2">
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
	</div>
{/if}
