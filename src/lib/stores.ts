import type { ComponentType } from 'svelte';
import { writable } from 'svelte/store';
import Authorization from './components/pages/authorization.svelte';
import type { GuildType } from './types';

export const unauthorized = writable<boolean>(false);
export const currentPageComponent = writable<ComponentType | null>(Authorization);
export const pageComponent = writable<ComponentType | null>(Authorization);
export const guilds = writable<GuildType[] | null>(null);
export const guildId = writable<number | null>(null);
export const selectedGuildId = writable<number | null>(null);
