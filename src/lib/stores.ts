import type { ComponentType } from 'svelte';
import { writable } from 'svelte/store';
import Authorization from './components/pages/authorization.svelte';
import type { GuildType, Pagination } from './types';

export const unauthorized = writable<boolean>(false);
export const currentPageComponent = writable<ComponentType | null>(Authorization);
export const pageComponent = writable<ComponentType | null>(Authorization);
export const guilds = writable<GuildType[] | null>(null);
export const guildId = writable<number | null>(null);
export const selectedGuildId = writable<number | null>(null);
export const adTitle = writable<string>('');
export const adPage = writable<number>(1);
export const adPagination = writable<Pagination<string>>({
	items: [],
	page: 1,
	next: false
});
