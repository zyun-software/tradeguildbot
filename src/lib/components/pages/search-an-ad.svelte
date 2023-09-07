<script lang="ts">
	import { adPage, adPagination, adTitle, pageComponent } from '$lib/stores';
	import type { GuildType, Pagination } from '$lib/types';
	import { requestUtility } from '$lib/utilities';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import ViewAnAd from './view-an-ad.svelte';

	let searchAnAd = {
		titlePart: ''
	};

	let guild: GuildType;

	let disabled: boolean = false;

	const onSubmit = async () => {
		const response = await requestUtility<Pagination<string>>('get-announcements', {
			guild_id: guild.id,
			page: $adPage,
			...searchAnAd
		});
		if (response) {
			adPagination.set(response);
		} else {
			adPagination.set({
				items: [],
				page: 1,
				next: false
			});
		}
	};
</script>

<GuildPage
	title="📢 Пошук оголошень"
	hint="ℹ️ Тут можна шукати оголошення членів гільдії"
	needAnnouncementTitles={true}
	backButtonCallback={() => {
		adPage.set(1);
		adPagination.set({
			items: [],
			page: 1,
			next: false
		});
	}}
	bind:guild
>
	<Form {onSubmit}>
		<Input
			id="name"
			name="🏷️ Назва"
			value={searchAnAd.titlePart}
			datalist="announcement-titles"
			onInput={(value) => {
				searchAnAd.titlePart = value;
			}}
		/>
		<button {disabled} class="w-full">Пошук</button>
	</Form>
	<div class="px-4 my-4">
		{#if $adPagination.page > 1}
			<button
				on:click={() => {
					adPage.update((v) => v - 1);
					onSubmit();
				}}
				{disabled}
				class="w-full mb-2">Попередня сторінка</button
			>
		{/if}
		{#each $adPagination.items as title}
			<button
				class="w-full bg-tg-secondary-bg-color text-left mb-2"
				on:click={() => {
					adTitle.set(title);
					pageComponent.set(ViewAnAd);
				}}>{title}</button
			>
		{/each}
		{#if $adPagination.next}
			<button
				on:click={() => {
					adPage.update((v) => v + 1);
					onSubmit();
				}}
				{disabled}
				class="w-full">Наступна сторінка</button
			>
		{/if}
	</div>
</GuildPage>
