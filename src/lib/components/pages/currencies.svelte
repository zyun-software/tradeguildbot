<script lang="ts">
	import type { CurrencyType, GuildType } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Control from './control.svelte';

	let guild: GuildType;

	let currencies: CurrencyType[] = [];

	const loadList = async () => {
		const response = await requestUtility<CurrencyType[]>('get-guild-currencies', {
			guild_id: guild.id
		});
		if (response) {
			currencies = response;
		}
	};

	let disabled: boolean = false;

	const process = async (options: {
		action: 'add' | 'save' | 'delete';
		code?: string;
		name?: string;
		id?: number;
		clear?: boolean;
	}) => {
		disabled = true;
		const response = await requestUtility<string>('process-guild-currency', {
			guild_id: guild.id,
			...options
		});
		if (response) {
			alertUtility(response);
			await loadList();
			if (options.clear) {
				currency.code = '';
				currency.name = '';
			}
		}
		disabled = false;
	};

	const currency = {
		code: '',
		name: ''
	};
</script>

<GuildPage
	title="💱 Редагування Валют"
	hint="ℹ️ Тут можна відредагувати валюти"
	backToPage={Control}
	needNicknames={false}
	needCurrencies={false}
	mountCallback={loadList}
	bind:guild
>
	<div class="mb-4">
		<Form
			onSubmit={() =>
				process({
					action: 'add',
					clear: true,
					...currency
				})}
		>
			<Input
				id="add-code"
				name="🎫 Код"
				value={currency.code}
				required={true}
				onInput={(value) => {
					currency.code = value;
				}}
			/>
			<Input
				id="add-name"
				name="🏷 Назва"
				value={currency.name}
				required={true}
				onInput={(value) => {
					currency.name = value;
				}}
			/>
			<button {disabled} class="w-full">Додати</button>
		</Form>
	</div>

	{#each currencies as { id, code, name, capital }}
		<div class="px-4 mb-2">
			<div class="bg-tg-secondary-bg-color rounded p-2">
				<Input
					id="save-code-{id}"
					name="🎫 Код"
					value={code}
					required={true}
					onInput={(value) => {
						code = value;
					}}
				/>
				<Input
					id="save-name-{id}"
					name="🏷 Назва"
					value={name}
					required={true}
					onInput={(value) => {
						name = value;
					}}
				/>
				<Input
					id="save-capital-{id}"
					name="💰 Капітал"
					value={capital}
					required={true}
					readonly={true}
				/>
				<div class="grid grid-cols-2 gap-2">
					<button
						on:click={() =>
							process({
								action: 'save',
								id,
								code,
								name
							})}
						{disabled}
						class="bg-green-500">Редагувати</button
					>
					<button
						on:click={() =>
							confirmUtility(`❓ Дійсно видалити валюту ${name}?`, (yes) => {
								if (!yes) return;
								process({
									action: 'delete',
									id
								});
							})}
						{disabled}
						class="bg-red-500">Видалити</button
					>
				</div>
			</div>
		</div>
	{/each}
</GuildPage>
