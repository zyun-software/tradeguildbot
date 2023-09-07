<script lang="ts">
	import type { GuildType, Invoice, OptionType, Pagination } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Select from '../parts/fieldset/select.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Services from './services.svelte';

	let currencyOptions: OptionType<number>[] = [];

	let options = [
		{ value: 'seller_create', text: 'Виставлені мною' },
		{ value: 'payer_create', text: 'Виставлені платником' },
		{ value: 'seller_paid', text: 'Сплачені мною' },
		{ value: 'payer_paid', text: 'Сплачені платником' }
	];

	let search = {
		id: '',
		type: options[0].value,
		name: '',
		purpose: '',
		currency_id: -1,
		page: 1
	};

	let guild: GuildType;

	let disabled: boolean = false;

	let pagination: Pagination<Invoice> | undefined = undefined;

	const onSubmit = async () => {
		const response = await requestUtility<Pagination<Invoice>>('get-invoices', {
			guild_id: guild.id,
			...search
		});

		pagination = response ? response : { items: [], page: 1, next: false };
	};

	const process = async (options: { action: 'pay' | 'no_pay' | 'cancel'; id: number }) => {
		disabled = true;
		const response = await requestUtility<string>('process-invoice', {
			guild_id: guild.id,
			...options
		});
		if (response) {
			alertUtility(response, onSubmit);
		}
		disabled = false;
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
		{/if}
		<button {disabled} class="w-full">Переглянути</button>
	</Form>
	{#if pagination}
		<div class="px-4 my-4">
			{#if pagination.page > 1}
				<button
					on:click={() => {
						search.page--;
						onSubmit();
					}}
					{disabled}
					class="w-full mb-2"
					>Попередня сторінка
				</button>
			{/if}
			{#each pagination.items as { id, paid, amount, currency_code, seller_name, payer_name, purpose, can_pay, can_cancel }}
				<div class="rounded p-2 bg-tg-secondary-bg-color mb-2">
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>🎫 Код</div>
						<div>{id}</div>
					</div>
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>💰 Сума</div>
						<div>{amount} {currency_code}</div>
					</div>
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>🔠 Статус</div>
						<div>{paid ? '💸 Оплачено' : '⏳ Очікується'}</div>
					</div>
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>🛒 Продавець</div>
						<div>{seller_name}</div>
					</div>
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>🛍️ Платник</div>
						<div>{payer_name}</div>
					</div>
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>💼 Призначення</div>
						<div>{purpose}</div>
					</div>
					{#if can_pay}
						<div class="grid grid-cols-2 gap-2">
							<button
								{disabled}
								on:click={() =>
									confirmUtility(`❓ Дійсно сплатити рахунок #${id}?`, (yes) => {
										if (!yes) return;
										process({
											id,
											action: 'pay'
										});
									})}
								class="bg-green-500">Сплатити</button
							>
							<button
								{disabled}
								on:click={() =>
									confirmUtility(`❓ Дійсно відмовитися від сплати рахунку #${id}?`, (yes) => {
										if (!yes) return;
										process({
											id,
											action: 'no_pay'
										});
									})}
								class="bg-red-500">Відмовитися</button
							>
						</div>
					{/if}
					{#if can_cancel}
						<button
							{disabled}
							on:click={() =>
								confirmUtility(`❓ Дійсно скасувати рахунок #${id}?`, (yes) => {
									if (!yes) return;
									process({
										id,
										action: 'cancel'
									});
								})}
							class="w-full bg-red-500">Скасувати</button
						>
					{/if}
				</div>
			{/each}
			{#if pagination.next}
				<button
					on:click={() => {
						search.page++;
						onSubmit();
					}}
					{disabled}
					class="w-full"
					>Наступна сторінка
				</button>
			{/if}
		</div>
	{/if}
</GuildPage>
