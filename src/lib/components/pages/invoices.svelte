<script lang="ts">
	import type { CurrencyType, GuildType } from '$lib/types';
	import { requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Textarea from '../parts/fieldset/textarea.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Services from './services.svelte';

	let currencies: { value: number; text: string }[] = [];

	const loadCurrencyList = async () => {
		const response = await requestUtility<CurrencyType[]>('get-guild-currencies', {
			guild_id: guild.id
		});
		if (response) {
			if (response.length) {
				search.currency_id = response[0].id;
			}
			currencies = response.map((item) => {
				return {
					value: item.id,
					text: item.name
				};
			});
		}
	};

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

		// await confirmUtility(`❓ Дійсно виставити рахунок ${bill.name}?`, async (yes) => {
		// 	if (!yes) return;
		// 	disabled = true;
		// 	const response = await requestUtility<string>('bill', {
		// 		guild_id: guild.id,
		// 		...bill
		// 	});
		// 	if (response) {
		// 		alertUtility(response);
		// 		bill.name = '';
		// 		bill.amount = '';
		// 		bill.purpose = '';
		// 	}
		// 	disabled = false;
		// });
	};
</script>

<GuildPage
	title="🧾 Перегляд рахунків"
	hint="ℹ️ Тут можна переглянути виставлені вам і виставлені вами рахунки а також сплатити рахунки"
	backToPage={Services}
	needNicknames={true}
	onGetGuild={(value) => {
		guild = value;
		loadCurrencyList();
	}}
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
				options={currencies}
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
