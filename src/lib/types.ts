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

export type OptionType<TValue extends string | number> = {
	value: TValue;
	text: string;
};

export type Pagination<TItem> = {
	items: TItem[];
	next: boolean;
	page: number;
};

export type ExchangeOffer = {
	id: number;
	sell_currency_id: number;
	sell_amount: number;
	buy_currency_id: number;
	buy_amount: number;
};

export type Announcement = {
	id: number;
	title: string;
	description: string;
	seller: string;
};

export type ApiInvoice = {
	id: number;
	paid: boolean;
	amount: number;
	currency_id: number;
	currency_code: string;
	seller_name: string;
	payer_name: string;
	purpose: string;
};

export type Invoice = ApiInvoice & {
	can_pay: boolean;
	can_cancel: boolean;
};
