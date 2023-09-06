<script lang="ts">
	import type { GuildType } from '$lib/types';
	import { requestUtility } from '$lib/utilities';
	import { onMount } from 'svelte';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';

	let apiSettings: {
		token: string;
		url: string;
	} = {
		token: '',
		url: ''
	};

	let guild: GuildType;

	let disabled: boolean = false;

	const load = async (action: 'get' | 'update') => {
		disabled = true;
		const response = await requestUtility<typeof apiSettings>('api-settings', {
			guild_id: guild.id,
			action
		});
		if (response) {
			apiSettings = response;
		}
		disabled = false;
	};

	onMount(async () => await load('get'));

	const onSubmit = async () => {
		await load('update');
	};
</script>

<GuildPage title="🤖 API" hint="ℹ️ Тут відображена інформація про API" bind:guild>
	<Form {onSubmit}>
		<Input id="token" name="🔑 Токен" readonly={true} value={apiSettings.token} />
		<Input id="url" name="🌐 Посилання" readonly={true} value={apiSettings.url} />
		<button {disabled} class="w-full">Оновити</button>
	</Form>
</GuildPage>
