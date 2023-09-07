import { Entity, RepositoryId, type RepositorySave } from '$lib/server/core';
import type { GuildMemberEntity } from './guild-member';

export abstract class AccountRepository
	extends RepositoryId<AccountEntity>
	implements RepositorySave<AccountEntity>
{
	public abstract updateBalance(entity: AccountEntity): Promise<void>;
	public abstract updateReserve(entity: AccountEntity): Promise<void>;
	public abstract updateMoneyRequest(entity: AccountEntity): Promise<void>;
	public abstract updateMoneyRequestType(entity: AccountEntity): Promise<void>;
	public abstract updateMoneyRequestAmount(entity: AccountEntity): Promise<void>;

	public abstract getGuildMember(entity: AccountEntity): Promise<GuildMemberEntity>;

	public abstract findByGuildMemberIdAndCurrencyId(
		guild_member_id: number,
		currency_id: number
	): Promise<AccountEntity | null>;
	public abstract save(entity: AccountEntity): Promise<AccountEntity>;
}

export class AccountDefaultValue {
	public static guild_member_id: number = -1;
	public static currency_id: number = -1;
	public static balance: number = 0;
	public static reserve: number = 0;
}

type MoneyRequestType = 'introduction' | 'receiving';

export type AccountModel = {
	id: number;
	guild_member_id: number;
	currency_id: number;
	balance: number;
	reserve: number;
	money_request: boolean;
	money_request_type: MoneyRequestType;
	money_request_amount: number;
};

export class AccountEntity extends Entity<AccountModel, AccountRepository> {
	public get guild_member_id(): number {
		return this.__model.guild_member_id;
	}

	public get currency_id(): number {
		return this.__model.currency_id;
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

	public async addToBalance(value: number): Promise<AccountEntity> {
		const result = await this.setBalance(this.__model.balance + value);

		return result;
	}

	public async removeFromBalance(value: number): Promise<AccountEntity> {
		const result = await this.setBalance(this.__model.balance - value);

		return result;
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

	public async addToReserve(value: number): Promise<AccountEntity> {
		const result = await this.setReserve(this.__model.reserve + value);

		return result;
	}

	public async removeFromReserve(value: number): Promise<AccountEntity> {
		const result = await this.setReserve(this.__model.reserve - value);

		return result;
	}

	public get money_request(): boolean {
		return this.__model.money_request;
	}

	public async setMoneyRequest(value: boolean): Promise<AccountEntity> {
		this.__model.money_request = value;
		if (this.__created) {
			await this.__repository.updateMoneyRequest(this);
		}

		return this;
	}

	public get money_request_type(): MoneyRequestType {
		return this.__model.money_request_type;
	}

	public async setMoneyRequestType(value: MoneyRequestType): Promise<AccountEntity> {
		this.__model.money_request_type = value;
		if (this.__created) {
			await this.__repository.updateMoneyRequestType(this);
		}

		return this;
	}

	public get money_request_amount(): number {
		return this.__model.money_request_amount;
	}

	public async setMoneyRequestAmount(value: number): Promise<AccountEntity> {
		this.__model.money_request_amount = value;
		if (this.__created) {
			await this.__repository.updateMoneyRequestAmount(this);
		}

		return this;
	}

	public async getGuildMember(): Promise<GuildMemberEntity> {
		const guildMember = await this.__repository.getGuildMember(this);

		return guildMember;
	}
}
