import { Entity, type RepositorySave } from '$lib/server/core';

export abstract class AccountRepository implements RepositorySave<AccountEntity> {
	public abstract updateGuildMemberId(entity: AccountEntity): Promise<void>;
	public abstract updateCurrencyId(entity: AccountEntity): Promise<void>;
	public abstract updateBalance(entity: AccountEntity): Promise<void>;
	public abstract updateReserve(entity: AccountEntity): Promise<void>;

	public abstract save(entity: AccountEntity): Promise<AccountEntity>;
}

export class AccountDefaultValue {
	public static guild_member_id: number = -1;
	public static currency_id: number = -1;
	public static balance: number = 0;
	public static reserve: number = 0;
}

export type AccountModel = {
	id: number;
	guild_member_id: number;
	currency_id: number;
	balance: number;
	reserve: number;
};

export class AccountEntity extends Entity<AccountModel, AccountRepository> {
	public get guild_member_id(): number {
		return this.__model.guild_member_id;
	}

	public async setGuildMemberId(value: number): Promise<AccountEntity> {
		this.__model.guild_member_id = value;
		if (this.__created) {
			await this.__repository.updateGuildMemberId(this);
		}

		return this;
	}

	public get currency_id(): number {
		return this.__model.currency_id;
	}

	public async setCurrencyId(value: number): Promise<AccountEntity> {
		this.__model.currency_id = value;
		if (this.__created) {
			await this.__repository.updateCurrencyId(this);
		}

		return this;
	}

	public get balance(): number {
		return this.__model.balance;
	}

	public async setBalance(value: number): Promise<AccountEntity> {
		this.__model.balance = value;
		if (this.__created) {
			await this.__repository.updateBalance(this);
		}

		return this;
	}

	public get reserve(): number {
		return this.__model.reserve;
	}

	public async setReserve(value: number): Promise<AccountEntity> {
		this.__model.reserve = value;
		if (this.__created) {
			await this.__repository.updateReserve(this);
		}

		return this;
	}
}
