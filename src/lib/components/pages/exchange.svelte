<script lang="ts">
	import type { GuildType, OptionType } from '$lib/types';
	import Select from '../parts/fieldset/select.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';

	let exchange = {
		name: '',
		sell_currency_id: -1,
		buy_currency_id: -1
	};

	let guild: GuildType;

	let disabled: boolean = false;

	let options: OptionType<number>[] = [];

	const onSubmit = async () => {
		console.log(exchange);
	};
</script>

<GuildPage
	title="💱 Біржа"
	hint="ℹ️ Тут можна шукати пропозиції обміну валют"
	needCurrencies={true}
	mountCallback={({ currency }) => {
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
			id="sell_currency_id"
			name="🛒 Продаю"
			onChange={(value) => {
				exchange.sell_currency_id = value;
			}}
			selected={exchange.sell_currency_id}
			{options}
		/>
		<Select
			id="buy_currency_id"
			name="🛍️ Купляю"
			onChange={(value) => {
				exchange.buy_currency_id = value;
			}}
			selected={exchange.buy_currency_id}
			{options}
		/>
		<button {disabled} class="w-full">Пошук</button>
	</Form>
</GuildPage>
