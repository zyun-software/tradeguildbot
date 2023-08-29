<script lang="ts">
	import type { GuildType } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Control from './control.svelte';

	let guild: GuildType;

	type Item = {
		id: number;
		name: string;
	};

	let list: Item[] = [];
	let disabledFilter: boolean = false;
	let disabledProcess: boolean = false;
	let name: string = '';

	const loadList = async () => {
		disabledFilter = true;
		const result = await requestUtility<Item[]>('find-not-approved-guild-members', {
			guild_id: guild.id,
			name
		});

		if (result) {
			list = result;
		}

		disabledFilter = false;
	};

	const process = async (id: number, name: string, action: 'approve' | 'reject') => {
		await confirmUtility(
			`❓ ${action === 'approve' ? 'Схвалити' : 'Відхилити'} заявку від ${name}?`,
			async (yes) => {
				if (!yes) return;
				disabledProcess = true;
				const response = await requestUtility<string>('process-joining-the-guild', {
					guild_id: guild.id,
					id,
					action
				});
				if (response) {
					alertUtility(response);
					await loadList();
				}
				disabledProcess = false;
			}
		);
	};
</script>

<GuildPage
	title="📄 Заявки на вступ"
	hint="ℹ️ Тут відображені актуальні запити на вступ до гільдії, які ви зможете затвердити або відхилити"
	backToPage={Control}
	needNicknames={false}
	onGetGuild={(value) => {
		guild = value;
		loadList();
	}}
>
	<Form onSubmit={loadList}>
		<Input id="nickname" name="🏷️ Псевдонім" value={name} onInput={(value) => (name = value)} />
		<button class="w-full" disabled={disabledFilter}>Фільтрувати</button>
	</Form>

	<div class="px-4 mt-4">
		{#if list.length > 0}
			{#each list as { id, name }}
				<div class="rounded p-2 bg-tg-secondary-bg-color mb-2">
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>🏷️ Псевдонім</div>
						<div>{name}</div>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<button
							disabled={disabledProcess}
							on:click={() => process(id, name, 'approve')}
							class="bg-green-500">Схвалити</button
						>
						<button
							disabled={disabledProcess}
							on:click={() => process(id, name, 'reject')}
							class="bg-red-500">Відхилити</button
						>
					</div>
				</div>
			{/each}
		{:else}
			<div class="rounded p-2 bg-tg-secondary-bg-color text-center">
				🤷‍♂️ Запити на вступ до гільдії відсутні
			</div>
		{/if}
	</div>
</GuildPage>
