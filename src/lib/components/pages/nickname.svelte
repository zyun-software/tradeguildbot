<script lang="ts">
	import { guilds, pageComponent, selectedGuildId } from '$lib/stores';
	import type { GuildType } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility, showBackButton } from '$lib/utilities';
	import { onMount } from 'svelte';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import Hint from '../parts/hint.svelte';
	import NicknamesList from '../parts/nicknames-list.svelte';
	import Title from '../parts/title.svelte';
	import Control from './control.svelte';
	import Guild from './guild.svelte';

	onMount(() => {
		showBackButton(() => {
			pageComponent.set(Control);
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

	let disabled: boolean = false;

	const nickname = {
		old: '',
		new: ''
	};

	const onSubmit = async () => {
		await confirmUtility(
			`❓ Дійсно змінити псевдонім з ${nickname.old} на ${nickname.new}?`,
			async (yes) => {
				if (!yes) return;
				disabled = true;
				const response = await requestUtility<string>('change-guild-member-nickname', {
					guild_id: guild.id,
					...nickname
				});
				if (response) {
					alertUtility(response);
					nickname.old = '';
					nickname.new = '';
				}
				disabled = false;
			}
		);
	};
</script>

<Title text="✍🏻 Редагування псевдоніма" />

<Hint text="ℹ️ Тут можна відредагувати псевдонім учасника гільдії" />

<NicknamesList guild_id={guild.id} />

<Form {onSubmit}>
	<Input
		id="old-nickname"
		name="Попередній"
		value={nickname.old}
		required={true}
		datalist="nicknames"
		onInput={(value) => {
			nickname.old = value;
		}}
	/>
	<Input
		id="new-nickname"
		name="Новий"
		value={nickname.new}
		required={true}
		onInput={(value) => {
			nickname.new = value;
		}}
	/>
	<button {disabled} class="w-full">Змінити</button>
</Form>
