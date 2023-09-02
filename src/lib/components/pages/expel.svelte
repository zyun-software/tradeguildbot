<script lang="ts">
	import type { GuildType } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Control from './control.svelte';

	let guild: GuildType;

	let disabled: boolean = false;

	let expelNickname = '';

	const onSubmit = async () => {
		await confirmUtility(`❓ Дійсно вигнати ${expelNickname} з гільдії?`, async (yes) => {
			if (!yes) return;
			disabled = true;
			const response = await requestUtility<string>('expel-guild-member', {
				guild_id: guild.id,
				name: expelNickname
			});
			if (response) {
				alertUtility(response);
				expelNickname = '';
			}
			disabled = false;
		});
	};
</script>

<GuildPage
	title="⛔ Вигнання учасника гільдії"
	hint="ℹ️ Тут можна вигнати учасника гільдії"
	backToPage={Control}
	needNicknames={true}
	onGetGuild={(value) => {
		guild = value;
	}}
>
	<Form {onSubmit}>
		<Input
			id="nickname"
			name="🏷️ Псевдонім"
			value={expelNickname}
			required={true}
			datalist="nicknames"
			onInput={(value) => {
				expelNickname = value;
			}}
		/>
		<button {disabled} class="w-full">Вигнати</button>
	</Form>
</GuildPage>
