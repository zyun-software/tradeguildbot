<script lang="ts">
	import type { GuildType, OptionType } from '$lib/types';
	import { alertUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Textarea from '../parts/fieldset/textarea.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Services from './services.svelte';

	let options: OptionType<number>[] = [];

	let guild: GuildType;

	let disabled: boolean = false;

	let bill = {
		name: '',
		amount: '',
		purpose: '',
		currency_id: -1
	};

	const onSubmit = async () => {
		disabled = true;
		const response = await requestUtility<string>('bill', {
			guild_id: guild.id,
			...bill
		});
		if (response) {
			alertUtility(response);
			bill.name = '';
			bill.amount = '';
			bill.purpose = '';
		}
		disabled = false;
	};
</script>

<GuildPage
	title="📋 Виставлення рахунку"
	hint="ℹ️ Тут можна виставити рахунок учаснику гільдії"
	backToPage={Services}
	needNicknames={true}
	needCurrencies={true}
	mountCallback={({ currency }) => {
		options = currency.options;
		if (options.length) {
			bill.currency_id = options[0].value;
		}
	}}
	bind:guild
>
	<Form {onSubmit}>
		<Input
			id="nickname"
			name="🏷️ Псевдонім"
			value={bill.name}
			required={true}
			datalist="nicknames"
			onInput={(value) => {
				bill.name = value;
			}}
		/>
		<Select
			id="currency"
			name="💱 Валюта"
			onChange={(value) => {
				bill.currency_id = value;
			}}
			selected={bill.currency_id}
			{options}
		/>
		<Input
			id="amount"
			name="💰 Сума"
			type="number"
			value={bill.amount}
			required={true}
			onInput={(value) => {
				bill.amount = value;
			}}
		/>
		<Textarea
			id="purpose"
			name="💼 Призначення"
			required={true}
			bind:value={bill.purpose}
			onInput={(value) => {
				bill.purpose = value;
			}}
		/>
		<button {disabled} class="w-full">Виставити рахунок</button>
	</Form>
</GuildPage>
