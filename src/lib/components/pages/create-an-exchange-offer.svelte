<script lang="ts">
	import type { CurrencyType, ExchangeOffer, GuildType, OptionType, Pagination } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility } from '$lib/utilities';
	import { onMount } from 'svelte';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Services from './services.svelte';

	let currencies: CurrencyType[] = [];
	let options: OptionType<number>[] = [];

	let exchangeProposals: Pagination<ExchangeOffer> = {
		items: [],
		page: 1,
		next: false
	};

	const loadExchangeProposals = async () => {
		const response = await requestUtility<Pagination<ExchangeOffer>>('get-exchange-proposals', {
			guild_id: guild.id,
			personal: true
		});
		if (response) {
			exchangeProposals = response;
		}
	};

	let exchangeOffer = {
		id: '',
		sell_currency_id: -1,
		sell_amount: '',
		buy_currency_id: -1,
		buy_amount: ''
	};

	let guild: GuildType;

	let disabled: boolean = false;

	const onSubmit = async () => {
		disabled = true;
		const response = await requestUtility<string>('create-an-exchange-offer', {
			guild_id: guild.id,
			...exchangeOffer
		});
		if (response) {
			alertUtility(response);
			exchangeOffer.id = '';
			exchangeOffer.sell_amount = '';
			exchangeOffer.buy_amount = '';
		}
		disabled = false;
	};

	const cancel = async (id: number) => {
		await confirmUtility(`❓ Дійсно скасувати пропозицію обміну?`, async (yes) => {
			if (!yes) return;
			disabled = true;
			const response = await requestUtility<string>('process-exchange-offer', {
				guild_id: guild.id,
				action: 'cancel',
				id
			});
			if (response) {
				alertUtility(response);
			}
			loadExchangeProposals();
			disabled = false;
		});
	};

	onMount(() => {
		loadExchangeProposals();
	});
</script>

<GuildPage
	title="💱 Створення обміну на біржі"
	hint="ℹ️ Тут можна створити обмін на біржі а також відмінити його"
	backToPage={Services}
	needCurrencies={true}
	mountCallback={({ currency }) => {
		currencies = currency.items;
		options = currency.options;
		if (options.length) {
			exchangeOffer.buy_currency_id = options[0].value;
			exchangeOffer.sell_currency_id = options[0].value;
		}
	}}
	bind:guild
>
	<Form {onSubmit}>
		<Select
			id="from_currency"
			name="🛒 Валюта продажу"
			onChange={(value) => {
				exchangeOffer.sell_currency_id = value;
			}}
			selected={exchangeOffer.sell_currency_id}
			{options}
		/>
		<Input
			id="from_amount"
			name="💰 Сума продажу"
			type="number"
			required={true}
			value={exchangeOffer.sell_amount}
			onInput={(value) => {
				exchangeOffer.sell_amount = value;
			}}
		/>
		<Select
			id="to_currency"
			name="🛍️ Валюта купівлі"
			onChange={(value) => {
				exchangeOffer.buy_currency_id = value;
			}}
			selected={exchangeOffer.buy_currency_id}
			{options}
		/>
		<Input
			id="to_amount"
			name="💰 Сума купівлі"
			type="number"
			required={true}
			value={exchangeOffer.buy_amount}
			onInput={(value) => {
				exchangeOffer.buy_amount = value;
			}}
		/>
		<button {disabled} class="w-full">Створити пропозицію</button>
	</Form>
	<div class="mt-4">
		{#each exchangeProposals.items as exchangeOffer}
			<div class="mb-2 mx-4 p-2 rounded bg-tg-secondary-bg-color">
				<div class="grid grid-cols-2 gap-2 mb-2">
					<div>💲 Продаю</div>
					<div>
						{exchangeOffer.sell_amount}
						{currencies.find((item) => item.id === exchangeOffer.sell_currency_id)?.code}
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 mb-2">
					<div>🛒 Купляю</div>
					<div>
						{exchangeOffer.buy_amount}
						{currencies.find((item) => item.id === exchangeOffer.buy_currency_id)?.code}
					</div>
				</div>
				<button on:click={() => cancel(exchangeOffer.id)} {disabled} class="bg-red-500 w-full"
					>Скасувати</button
				>
			</div>
		{/each}
	</div>
</GuildPage>
