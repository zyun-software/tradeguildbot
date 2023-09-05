<script lang="ts">
	import { guilds, pageComponent, selectedGuildId } from '$lib/stores';
	import type { CurrencyType, GuildType, OptionType } from '$lib/types';
	import { requestUtility, showBackButton } from '$lib/utilities';
	import { onMount, type ComponentType } from 'svelte';
	import Guild from '../pages/guild.svelte';
	import Hint from '../parts/hint.svelte';
	import Title from '../parts/title.svelte';

	export let backToPage: ComponentType = Guild;
	export let title: string;
	export let hint: string;
	export let needNicknames: boolean = false;
	export let needCurrencies: boolean = false;
	export let needAnnouncementTitles: boolean = false;
	export let guild: GuildType | null = null;
	export let currency: { items: CurrencyType[]; options: OptionType<number>[] } = {
		items: [],
		options: []
	};
	export let mountCallback:
		| ((options: { guild: typeof guild; currency: typeof currency }) => void | Promise<void>)
		| undefined = undefined;

	const find = ($guilds ?? []).find((guild) => guild.id === $selectedGuildId);

	if (find) {
		guild = find;
	}

	let nicknameOptions: string[] = [];
	let announcementUniqueTitlesOptions: string[] = [];

	onMount(async () => {
		showBackButton(() => {
			pageComponent.set(backToPage);
		});

		if (guild) {
			if (needNicknames) {
				const response = await requestUtility<string[]>('get-guild-member-nicknames', {
					guild_id: guild.id
				});

				if (response) {
					nicknameOptions = response;
				}
			}

			if (needCurrencies) {
				const response = await requestUtility<CurrencyType[]>('get-guild-currencies', {
					guild_id: guild.id
				});
				if (response) {
					currency.items = response;
					currency.options = currency.items.map((item) => {
						return {
							value: item.id,
							text: item.name
						};
					});
				}
			}

			if (needAnnouncementTitles) {
				const response = await requestUtility<string[]>('get-guild-announcement-unique-titles', {
					guild_id: guild.id
				});
				if (response) {
					announcementUniqueTitlesOptions = response;
				}
			}
		}

		if (mountCallback) {
			await mountCallback({
				guild,
				currency
			});
		}
	});
</script>

{#if needNicknames}
	<datalist id="nicknames">
		{#each nicknameOptions as value}
			<option {value} />
		{/each}
	</datalist>
{/if}

{#if needAnnouncementTitles}
	<datalist id="announcement-titles">
		{#each announcementUniqueTitlesOptions as value}
			<option {value} />
		{/each}
	</datalist>
{/if}

<Title text={title} />

<Hint text={hint} />

<slot />
