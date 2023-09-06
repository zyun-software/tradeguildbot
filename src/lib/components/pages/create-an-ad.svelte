<script lang="ts">
	import type { Announcement, GuildType, Pagination } from '$lib/types';
	import { alertUtility, confirmUtility, requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import Services from './services.svelte';

	let createAnAd = {
		title: '',
		description: '',
		seller: ''
	};

	let guild: GuildType;

	let page = 1;
	let pagination: Pagination<Announcement> = {
		items: [],
		page,
		next: false
	};

	const loadList = async () => {
		const response = await requestUtility<Pagination<Announcement>>('get-announcements', {
			guild_id: guild.id,
			page,
			personal: true
		});
		if (response) {
			pagination = response;
		}
	};

	let disabled: boolean = false;

	const process = async (options: {
		action: 'delete' | 'save' | 'create';
		id?: number;
		title?: string;
		description?: string;
		seller?: string;
	}) => {
		disabled = true;
		const response = await requestUtility<string>('process-an-ad', {
			guild_id: guild.id,
			...options
		});
		if (response) {
			alertUtility(response);
			if (options.action === 'create') {
				createAnAd.title = '';
				createAnAd.description = '';
				createAnAd.seller = '';
			}
		}
		await loadList();
		disabled = false;
	};
</script>

<GuildPage
	title="📢 Створення оголошення"
	hint="ℹ️ Тут можна створювати оголошення та відміняти ого. 🔗 - посилання на пост в Telegram."
	needAnnouncementTitles={true}
	backToPage={Services}
	mountCallback={loadList}
	bind:guild
>
	<Form
		onSubmit={() =>
			process({
				action: 'create',
				...createAnAd
			})}
	>
		<Input
			id="title"
			name="🏷️ Назва"
			required={true}
			datalist="announcement-titles"
			value={createAnAd.title}
			onInput={(value) => {
				createAnAd.title = value;
			}}
		/>
		<Input
			id="description"
			name="🔗 Опис"
			required={true}
			value={createAnAd.description}
			onInput={(value) => {
				createAnAd.description = value;
			}}
		/>
		<Input
			id="seller"
			name="🔗 Продавець"
			required={true}
			value={createAnAd.seller}
			onInput={(value) => {
				createAnAd.seller = value;
			}}
		/>
		<button {disabled} class="w-full">Створити</button>
	</Form>
	<div class="px-4 my-4">
		{#if pagination.page > 1}
			<button
				on:click={() => {
					page -= 1;
					loadList();
				}}
				{disabled}
				class="w-full mb-2">Попередня сторінка</button
			>
		{/if}
		{#each pagination.items as { id, title, description, seller }}
			<div class="mb-2">
				<div class="bg-tg-secondary-bg-color rounded p-2">
					<Input
						id="save-title-{id}"
						name="🏷 Назва"
						value={title}
						required={true}
						onInput={(value) => {
							title = value;
						}}
					/>
					<Input
						id="save-description-{id}"
						name="🔗 Опис"
						value={description}
						required={true}
						onInput={(value) => {
							description = value;
						}}
					/>
					<Input
						id="save-seller-{id}"
						name="🔗 Автор"
						value={seller}
						required={true}
						onInput={(value) => {
							seller = value;
						}}
					/>
					<div class="grid grid-cols-2 gap-2">
						<button
							on:click={() => {
								process({
									action: 'save',
									id,
									title,
									description,
									seller
								});
							}}
							{disabled}
							class="bg-green-500">Редагувати</button
						>
						<button
							on:click={() =>
								confirmUtility(`❓ Дійсно видалити оголошення ${title}?`, (yes) => {
									if (!yes) return;
									process({
										action: 'delete',
										id
									});
								})}
							{disabled}
							class="bg-red-500">Видалити</button
						>
					</div>
				</div>
			</div>
		{/each}
		{#if pagination.next}
			<button
				on:click={() => {
					page += 1;
					loadList();
				}}
				{disabled}
				class="w-full">Наступна сторінка</button
			>
		{/if}
	</div>
</GuildPage>
