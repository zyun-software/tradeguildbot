<script lang="ts">
	import type { CurrencyType, ExchangeOffer, GuildType, OptionType, Pagination } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility } from '$lib/utilities';
	import Select from '../parts/fieldset/select.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';

	let exchange = {
		sell_currency_id: -1,
		buy_currency_id: -1
	};

	let currencies: CurrencyType[] = [];

	let guild: GuildType;

	let disabled: boolean = false;

	let options: OptionType<number>[] = [];

	let exchangeProposals: Pagination<ExchangeOffer> = {
		items: [],
		page: 1,
		next: false
	};

	let page = 1;

	const onSubmit = async () => {
		disabled = true;
		const response = await requestUtility<Pagination<ExchangeOffer>>('get-exchange-proposals', {
			guild_id: guild.id,
			page,
			...exchange
		});
		if (response) {
			exchangeProposals = response;
		}
		disabled = false;
	};

	const buy = async (id: number) => {
		const item = exchangeProposals.items.find((item) => item.id === id);
		const buy = currencies.find((i) => i.id === item?.buy_currency_id);
		const sell = currencies.find((i) => i.id === item?.sell_currency_id);
		await confirmUtility(
			`❓ Придбати ${item?.sell_amount} ${sell?.code} за ${item?.buy_amount} ${buy?.code}?`,
			async (yes) => {
				if (!yes) return;
				disabled = true;
				const response = await requestUtility<string>('process-exchange-offer', {
					guild_id: guild.id,
					action: 'buy',
					id
				});
				if (response) {
					alertUtility(response);
				}
				await onSubmit();
				disabled = false;
			}
		);
	};
</script>

<GuildPage
	title="💱 Біржа"
	hint="ℹ️ Тут можна шукати пропозиції обміну валют"
	needCurrencies={true}
	mountCallback={({ currency }) => {
		currencies = currency.items;
		options = currency.options;
		if (options.length) {
			exchange.buy_currency_id = currency.options[0].value;
			exchange.sell_currency_id = currency.options[0].value;
		}
	}}
	bind:guild
>
	<Form {onSubmit}>
		<Select
			id="buy_currency_id"
			name="🛍️ Купляю"
			onChange={(value) => {
				exchange.sell_currency_id = value;
			}}
			selected={exchange.sell_currency_id}
			{options}
		/>
		<Select
			id="sell_currency_id"
			name="🛒 Продаю"
			onChange={(value) => {
				exchange.buy_currency_id = value;
			}}
			selected={exchange.buy_currency_id}
			{options}
		/>
		<button {disabled} class="w-full">Пошук</button>
	</Form>
	<div class="mt-4 px-4">
		{#if exchangeProposals.page > 1}
			<button
				on:click={() => {
					page -= 1;
					onSubmit();
				}}
				{disabled}
				class="w-full mb-2">Попередня сторінка</button
			>
		{/if}
		{#each exchangeProposals.items as exchangeOffer}
			<div class="mb-2 p-2 rounded bg-tg-secondary-bg-color">
				<div class="grid grid-cols-2 gap-2 mb-2">
					<div>🛒 Продається</div>
					<div>
						{exchangeOffer.sell_amount}
						{currencies.find((item) => item.id === exchangeOffer.sell_currency_id)?.code}
					</div>
				</div>
				<button on:click={() => buy(exchangeOffer.id)} {disabled} class="bg-green-500 w-full">
					Придбати за <b>
						{exchangeOffer.buy_amount}
						{currencies.find((item) => item.id === exchangeOffer.buy_currency_id)?.code}
					</b>
				</button>
			</div>
		{/each}
		{#if exchangeProposals.next}
			<button
				on:click={() => {
					page += 1;
					onSubmit();
				}}
				{disabled}
				class="w-full">Наступна сторінка</button
			>
		{/if}
	</div>
</GuildPage>
