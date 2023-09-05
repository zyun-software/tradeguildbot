<script lang="ts">
	import type { GuildType, OptionType } from '$lib/types';
	import { alertUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Services from './services.svelte';

	let guild: GuildType;

	let disabled: boolean = false;

	let options: OptionType<number>[] = [];
	let types: { value: string; text: string }[] = [
		{ value: 'introduction', text: 'Внесення на рахунок' },
		{ value: 'receiving', text: 'Отримання готівки' }
	];

	const moneyRequest = {
		currency_id: -1,
		amount: 64,
		type: 'introduction'
	};

	const process = async () => {
		disabled = true;

		const response = await requestUtility<string>('create-money-request', {
			guild_id: guild.id,
			name: guild.nickname,
			...moneyRequest
		});

		if (response) {
			alertUtility(response);
		}

		disabled = false;
	};
</script>

<GuildPage
	title="💰 Запит коштів"
	hint="ℹ️ Тут можна створити запит на внесення або отримання коштів у відповідній валюті"
	backToPage={Services}
	needCurrencies={true}
	mountCallback={({ currency }) => {
		options = currency.options;
		if (options.length) {
			moneyRequest.currency_id = options[0].value;
		}
	}}
	bind:guild
>
	<Form onSubmit={process}>
		<Select
			id="currency"
			name="💱 Валюта"
			onChange={(value) => {
				moneyRequest.currency_id = value;
			}}
			selected={moneyRequest.currency_id}
			{options}
		/>

		<Select
			id="type"
			name="🔠 Тип"
			onChange={(value) => {
				moneyRequest.type = value;
			}}
			selected={moneyRequest.type}
			options={types}
		/>
		<Input
			id="amount"
			type="number"
			name="💰 Сума"
			value={moneyRequest.amount}
			required={true}
			onInput={(value) => {
				moneyRequest.amount = parseInt(value);
			}}
		/>
		<button {disabled} class="w-full">Створити запит</button>
	</Form>
</GuildPage>
