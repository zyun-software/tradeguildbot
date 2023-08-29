<script lang="ts">
	import type { GuildType } from '$lib/types';
	import { alertUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Services from './services.svelte';

	let guild: GuildType;

	type CurrencyType = {
		id: number;
		name: string;
	};

	let disabled: boolean = false;

	let currencies: { value: number; text: string }[] = [];
	let types: { value: string; text: string }[] = [
		{ value: 'introduction', text: 'Внесення' },
		{ value: 'receiving', text: 'Отримання' }
	];

	const loadList = async () => {
		const response = await requestUtility<CurrencyType[]>('get-guild-currencies', {
			guild_id: guild.id
		});
		if (response) {
			if (response.length) {
				moneyRequest.currency_id = response[0].id;
			}
			currencies = response.map((item) => {
				return {
					value: item.id,
					text: item.name
				};
			});
		}
	};

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
	needNicknames={false}
	onGetGuild={(value) => {
		guild = value;
		loadList();
	}}
>
	<Form onSubmit={process}>
		<Select
			id="currency"
			name="💱 Валюта"
			onChange={(value) => {
				moneyRequest.currency_id = value;
			}}
			selected={moneyRequest.currency_id}
			options={currencies}
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
