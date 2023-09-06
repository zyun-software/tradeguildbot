<script lang="ts">
	import type { GuildType, OptionType } from '$lib/types';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Textarea from '../parts/fieldset/textarea.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Services from './services.svelte';

	let currencyOptions: OptionType<number>[] = [];

	let options = [
		{ value: '1', text: 'Виставлені мною' },
		{ value: '2', text: 'Сплачені платником' },
		{ value: '3', text: 'Виставлені платником' },
		{ value: '4', text: 'Сплачені мною' }
	];

	let search = {
		id: '',
		type: options[0].value,
		name: '',
		purpose: '',
		currency_id: -1
	};

	let guild: GuildType;

	let disabled: boolean = false;

	const onSubmit = async () => {
		console.log(search);
	};
</script>

<GuildPage
	title="🧾 Перегляд рахунків"
	hint="ℹ️ Тут можна переглянути виставлені вам і виставлені вами рахунки а також сплатити рахунки"
	backToPage={Services}
	needNicknames={true}
	needCurrencies={true}
	mountCallback={({ currency }) => {
		currencyOptions = currency.options;
		if (currencyOptions.length) {
			search.currency_id = currencyOptions[0].value;
		}
	}}
	bind:guild
>
	<Form {onSubmit}>
		<Input
			id="code"
			type="number"
			name="🎫 Код"
			value={search.id}
			onInput={(value) => {
				search.id = value;
			}}
		/>
		{#if !search.id}
			<Select
				id="type"
				name="🔠 Тип"
				onChange={(value) => {
					search.type = value;
				}}
				selected={search.type}
				{options}
			/>
			<Select
				id="currency"
				name="💱 Валюта"
				onChange={(value) => {
					search.currency_id = value;
				}}
				selected={search.currency_id}
				options={currencyOptions}
			/>
			<Input
				id="nickname"
				name="🏷️ Псевдонім"
				value={search.name}
				datalist="nicknames"
				onInput={(value) => {
					search.name = value;
				}}
			/>
			<Textarea
				id="purpose"
				bind:value={search.purpose}
				name="💼 Призначення"
				onInput={(value) => {
					search.purpose = value;
				}}
			/>
		{/if}
		<button {disabled} class="w-full">Переглянути</button>
	</Form>
</GuildPage>