<script lang="ts">
	import type { GuildType } from '$lib/types';
	import { alertUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Control from './control.svelte';

	let guild: GuildType;

	let disabled: boolean = false;

	const nickname = {
		old: '',
		new: ''
	};

	const onSubmit = async () => {
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
	};
</script>

<GuildPage
	title="✍🏻 Редагування псевдоніма"
	hint="ℹ️ Тут можна відредагувати псевдонім учасника гільдії"
	backToPage={Control}
	needNicknames={true}
	bind:guild
>
	<Form {onSubmit}>
		<Input
			id="old-nickname"
			name="🏷️ Попередній"
			value={nickname.old}
			required={true}
			datalist="nicknames"
			onInput={(value) => {
				nickname.old = value;
			}}
		/>
		<Input
			id="new-nickname"
			name="🆕 Новий"
			value={nickname.new}
			required={true}
			onInput={(value) => {
				nickname.new = value;
			}}
		/>
		<button {disabled} class="w-full">Змінити</button>
	</Form>
</GuildPage>
