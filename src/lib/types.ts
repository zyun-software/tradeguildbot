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

export type AccountResponseType = {
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

export type CurrencyType = {
	id: number;
	code: string;
	name: string;
	capital: number;
};
