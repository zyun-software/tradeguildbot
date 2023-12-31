<script lang="ts">
	import type { AccountResponseType, GuildType, OptionType } from '$lib/types';
	import { alertUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Textarea from '../parts/fieldset/textarea.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';

	let guild: GuildType;

	let disabled: boolean = false;

	let options: OptionType<number>[] = [];

	let accountResponse: AccountResponseType | undefined = undefined;

	const loadAccount = async () => {
		disabled = true;
		const response = await requestUtility<AccountResponseType>('find-guild-member-account', {
			guild_id: guild.id,
			currency_id: transaction.currency_id,
			nickname: guild.nickname
		});
		if (response) {
			accountResponse = response;
		}
		disabled = false;
	};

	const transaction = {
		currency_id: -1,
		receiver: '',
		amount: '',
		comment: ''
	};

	const transferFunds = async () => {
		disabled = true;
		const response = await requestUtility<string>('transfer-funds', {
			guild_id: guild.id,
			...transaction
		});
		if (response) {
			alertUtility(response, loadAccount);
			transaction.amount = '';
			transaction.receiver = '';
			transaction.comment = '';
		}
		disabled = false;
	};
</script>

<GuildPage
	title="💳 Персональний рахунок"
	hint="ℹ️ Тут можна переглянути баланс у валютах та робити перекази коштів"
	needNicknames={true}
	needCurrencies={true}
	mountCallback={({ currency }) => {
		options = currency.options;
		if (options.length) {
			transaction.currency_id = options[0].value;
		}
	}}
	bind:guild
>
	<Form onSubmit={loadAccount}>
		<Select
			id="currency"
			name="💱 Валюта"
			onChange={(value) => {
				transaction.currency_id = value;
			}}
			selected={transaction.currency_id}
			{options}
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
		<Form onSubmit={transferFunds}>
			<Input
				id="receiver"
				datalist="nicknames"
				name="🏷️ Отримувач"
				required={true}
				value={transaction.receiver}
				onInput={(value) => {
					transaction.receiver = value;
				}}
			/>
			<Input
				id="amount"
				type="number"
				name="💰 Сума"
				required={true}
				value={transaction.amount}
				onInput={(value) => {
					transaction.amount = value;
				}}
			/>
			<Textarea
				id="comment"
				name="💬 Коментар"
				bind:value={transaction.comment}
				onInput={(value) => {
					transaction.comment = value;
				}}
			/>
			<button {disabled} class="w-full">Переказати кошти</button>
		</Form>
	{/if}
</GuildPage>
