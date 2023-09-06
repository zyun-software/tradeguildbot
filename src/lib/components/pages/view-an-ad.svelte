<script lang="ts">
	import { adTitle, pageComponent } from '$lib/stores';
	import type { Announcement, GuildType } from '$lib/types';
	import { requestUtility } from '$lib/utilities';
	import { onMount } from 'svelte';
	import GuildPage from '../parts/guild-page.svelte';
	import TelegramWidget from '../parts/telegram-widget.svelte';
	import SearchAnAd from './search-an-ad.svelte';

	let guild: GuildType;
	let announcements: Announcement[] = [];
	let isSeller: { [id: number]: boolean } = {};

	onMount(async () => {
		const response = await requestUtility<Announcement[]>('get-announcements', {
			guild_id: guild.id,
			title: $adTitle
		});
		if (response) {
			announcements = response;
			if (!announcements.length) {
				pageComponent.set(SearchAnAd);
			}
		}
	});
</script>

<GuildPage
	title="📢 {$adTitle}"
	hint="ℹ️ Перегляд оголошень за однаковим заголовком"
	needAnnouncementTitles={true}
	backToPage={SearchAnAd}
	bind:guild
>
	{#each announcements as { seller, description }, i}
		<div class="grid grid-cols-2 gap-2 px-4">
			<button
				on:click={() => {
					isSeller[i] = false;
				}}
				class={isSeller[i] ? 'bg-tg-secondary-bg-color' : ''}>Опис</button
			>
			<button
				on:click={() => {
					isSeller[i] = true;
				}}
				class={!isSeller[i] ? 'bg-tg-secondary-bg-color' : ''}>Автор</button
			>
		</div>
		{#if isSeller[i]}
			<TelegramWidget post={seller} />
		{:else}
			<TelegramWidget post={description} />
		{/if}
	{/each}
</GuildPage>
