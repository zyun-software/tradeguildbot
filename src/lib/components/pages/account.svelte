<script lang="ts">
	import type { AccountResponseType, CurrencyType, GuildType } from '$lib/types';
	import { requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Textarea from '../parts/fieldset/textarea.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Guild from './guild.svelte';

	let guild: GuildType;

	let disabled: boolean = false;

	let currencies: { value: number; text: string }[] = [];

	const loadCurrencyList = async () => {
		const response = await requestUtility<CurrencyType[]>('get-guild-currencies', {
			guild_id: guild.id
		});
		if (response) {
			if (response.length) {
				transactions.currency_id = response[0].id;
			}
			currencies = response.map((item) => {
				return {
					value: item.id,
					text: item.name
				};
			});
		}
	};

	let accountResponse: AccountResponseType | undefined = undefined;

	const loadAccount = async () => {
		disabled = true;
		const response = await requestUtility<AccountResponseType>('find-guild-member-account', {
			guild_id: guild.id,
			currency_id: transactions.currency_id,
			nickname: guild.nickname
		});
		if (response) {
			accountResponse = response;
		}
		disabled = false;
	};

	const transactions = {
		currency_id: -1,
		receiver: undefined,
		amount: undefined,
		commend: undefined
	};
</script>

<GuildPage
	title="💳 Персональний рахунок"
	hint="ℹ️ Тут можна переглянути баланс у валютах та робити перекази коштів"
	backToPage={Guild}
	needNicknames={true}
	onGetGuild={(value) => {
		guild = value;
		loadCurrencyList();
	}}
>
	<Form onSubmit={loadAccount}>
		<Select
			id="currency"
			name="💱 Валюта"
			onChange={(value) => {
				transactions.currency_id = value;
			}}
			selected={transactions.currency_id}
			options={currencies}
		/>
		<button {disabled} class="w-full">Переглянути баланс</button>
	</Form>
	{#if accountResponse}
		<div class="mt-4 px-4">
			<div class="rounded p-2 bg-tg-secondary-bg-color mb-4">
				<div class="grid grid-cols-2 gap-2 mb-2">
					<div>💱 Валюта</div>
					<div>{accountResponse.currency.name}</div>
				</div>
				<div class="grid grid-cols-2 gap-2 mb-2">
					<div>💰 Баланс</div>
					<div>{accountResponse.balance} {accountResponse.currency.code}</div>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div>🔒 Резерв</div>
					<div>{accountResponse.reserve} {accountResponse.currency.code}</div>
				</div>
			</div>
		</div>
		<Form onSubmit={() => {}}>
			<Input
				id="receiver"
				datalist="nicknames"
				name="🏷️ Отримувач"
				required={true}
				value=""
				onInput={(value) => {
					transactions.receiver = value;
				}}
			/>
			<Input
				id="amount"
				type="number"
				name="💰 Сума"
				required={true}
				value=""
				onInput={(value) => {
					transactions.amount = value;
				}}
			/>
			<Textarea
				id="comment"
				name="💬 Коментар"
				value=""
				onInput={(value) => {
					transactions.commend = value;
				}}
			/>
			<button {disabled} class="w-full">Переказати кошти</button>
		</Form>
	{/if}
</GuildPage>
