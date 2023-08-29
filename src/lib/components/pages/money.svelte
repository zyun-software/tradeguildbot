<script lang="ts">
	import type { GuildType } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility } from '$lib/utilities';
	import { onMount } from 'svelte';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Control from './control.svelte';

	type CurrencyType = {
		id: number;
		code: string;
		name: string;
	};

	onMount(async () => {
		const response = await requestUtility<CurrencyType[]>('get-guild-currencies', {
			guild_id: guild.id
		});
		if (response) {
			if (response.length) {
				account.currency_id = response[0].id;
			}
			options = response.map((item) => {
				return {
					value: item.id,
					text: item.name
				};
			});
		}
	});

	let guild: GuildType;

	let disabled: boolean = false;

	let options: { value: number; text: string }[] = [];

	const account = {
		nickname: '',
		currency_id: -1
	};

	type AccountResponseType = {
		name: string;
		currency: {
			name: string;
			code: string;
		};
		balance: number;
		reserve: number;
		moneyRequest?: {
			type: 'introduction' | 'receiving';
			amount: number;
		};
	};

	let accountResponse: AccountResponseType | undefined = undefined;

	const onSearchHandler = async () => {
		disabled = true;
		const response = await requestUtility<AccountResponseType>('find-guild-member-account', {
			guild_id: guild.id,
			...account
		});
		if (response) {
			accountResponse = response;
		}
		disabled = false;
	};

	const processMoneyRequest = async (action: 'approve' | 'reject') => {
		await confirmUtility(
			`❓ Дійсно ${action === 'approve' ? 'схвалити' : 'відхилити'} запит?`,
			async (yes) => {
				if (!yes) return;
				disabled = true;
				const response = await requestUtility<string>('process-money-request', {
					guild_id: guild.id,
					currency_id: account.currency_id,
					nickname: account.nickname,
					action
				});
				if (response) {
					alertUtility(response);
					await onSearchHandler();
				}
				disabled = false;
			}
		);
	};
</script>

<GuildPage
	title="💰 Керування коштами"
	hint="ℹ️ Тут можна керувати коштами учасника гільдії"
	backToPage={Control}
	needNicknames={true}
	onGetGuild={(value) => {
		guild = value;
	}}
>
	<Form onSubmit={onSearchHandler}>
		<Input
			id="nickname"
			name="🏷️ Псевдонім"
			value={account.nickname}
			required={true}
			datalist="nicknames"
			onInput={(value) => {
				account.nickname = value;
				accountResponse = undefined;
			}}
		/>
		<Select
			id="currency"
			name="💱 Валюта"
			onChange={(value) => {
				account.currency_id = value;
				accountResponse = undefined;
			}}
			selected={account.currency_id}
			{options}
		/>
		<button {disabled} class="w-full">Пошук</button>
	</Form>

	{#if accountResponse}
		<div class="mt-4 px-4">
			<div class="rounded p-2 bg-tg-secondary-bg-color mb-4">
				<div class="grid grid-cols-2 gap-2 mb-2">
					<div>🏷️ Псевдонім</div>
					<div>{accountResponse.name}</div>
				</div>
				<div class="grid grid-cols-2 gap-2 mb-2">
					<div>💱 Валюта</div>
					<div>{accountResponse.currency.name}</div>
				</div>
				<div class="grid grid-cols-2 gap-2 mb-2">
					<div>💰 Сума</div>
					<div>
						{accountResponse.balance + accountResponse.reserve} ({accountResponse.balance} / {accountResponse.reserve})
						{accountResponse.currency.code}
					</div>
				</div>
			</div>
			{#if accountResponse.moneyRequest}
				<div class="rounded p-2 bg-tg-secondary-bg-color mb-2">
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>🔁 Тип</div>
						<div>
							{accountResponse.moneyRequest.type === 'introduction' ? 'Внесення' : 'Отримання'} коштів
						</div>
					</div>
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>💰 Сума</div>
						<div>{accountResponse.moneyRequest.amount} {accountResponse.currency.code}</div>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<button on:click={() => processMoneyRequest('approve')} {disabled} class="bg-green-500"
							>Схвалити</button
						>
						<button on:click={() => processMoneyRequest('reject')} {disabled} class="bg-red-500"
							>Відхилити</button
						>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</GuildPage>
