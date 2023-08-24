import { Entity, type RepositorySave } from '$lib/server/core';

export abstract class ExchangeProposalRepository implements RepositorySave<ExchangeProposalEntity> {
	public abstract updateGuildMemberId(entity: ExchangeProposalEntity): Promise<void>;
	public abstract updateFromCurrencyId(entity: ExchangeProposalEntity): Promise<void>;
	public abstract updateFromAmount(entity: ExchangeProposalEntity): Promise<void>;
	public abstract updateToCurrencyId(entity: ExchangeProposalEntity): Promise<void>;
	public abstract updateToAmount(entity: ExchangeProposalEntity): Promise<void>;

	public abstract save(entity: ExchangeProposalEntity): Promise<ExchangeProposalEntity>;
}

export type ExchangeProposalModel = {
	id: number;
	guild_member_id: number;
	from_currency_id: number;
	from_amount: number;
	to_currency_id: number;
	to_amount: number;
};

export class ExchangeProposalEntity extends Entity<
	ExchangeProposalModel,
	ExchangeProposalRepository
> {
	public get guild_member_id(): number {
		return this.__model.guild_member_id;
	}

	public async setGuildMemberId(value: number): Promise<ExchangeProposalEntity> {
		this.__model.guild_member_id = value;
		if (this.__created) {
			await this.__repository.updateGuildMemberId(this);
		}

		return this;
	}

	public get from_currency_id(): number {
		return this.__model.from_currency_id;
	}

	public async setFromCurrencyId(value: number): Promise<ExchangeProposalEntity> {
		this.__model.from_currency_id = value;
		if (this.__created) {
			await this.__repository.updateFromCurrencyId(this);
		}

		return this;
	}

	public get from_amount(): number {
		return this.__model.from_amount;
	}

	public async setFromAmount(value: number): Promise<ExchangeProposalEntity> {
		this.__model.from_amount = value;
		if (this.__created) {
			await this.__repository.updateFromAmount(this);
		}

		return this;
	}

	public get to_currency_id(): number {
		return this.__model.to_currency_id;
	}

	public async setToCurrencyId(value: number): Promise<ExchangeProposalEntity> {
		this.__model.to_currency_id = value;
		if (this.__created) {
			await this.__repository.updateToCurrencyId(this);
		}

		return this;
	}

	public get to_amount(): number {
		return this.__model.to_amount;
	}

	public async setToAmount(value: number): Promise<ExchangeProposalEntity> {
		this.__model.to_amount = value;
		if (this.__created) {
			await this.__repository.updateToAmount(this);
		}

		return this;
	}
}
