import type { ComponentType } from 'svelte';
import { writable } from 'svelte/store';
import type { GuildType } from './types';

export const currentPageComponent = writable<ComponentType | null>(null);
export const pageComponent = writable<ComponentType | null>(null);
export const token = writable<string | null>();
export const guilds = writable<GuildType[] | null>();
export const selectedGuildId = writable<number | null>();
