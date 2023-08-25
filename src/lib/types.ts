import type { ComponentType } from 'svelte';

export type GuildType = {
	id: number;
	name: string;
	isOwner: boolean;
	isMember: boolean;
	nickname: string;
};

export type MenuButtonType = {
	emoji: string;
	text: string;
	component?: ComponentType;
	handler?: () => Promise<void> | void;
};
