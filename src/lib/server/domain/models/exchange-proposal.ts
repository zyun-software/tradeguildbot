import { Entity, RepositoryId, type PaginationType, type RepositorySave } from '$lib/server/core';

export abstract class ExchangeProposalRepository
	extends RepositoryId<ExchangeProposalEntity>
	implements RepositorySave<ExchangeProposalEntity>
{
	public abstract getListByGuildMemberId(
		guild_member_id: number,
		page: number
	): Promise<PaginationType<ExchangeProposalEntity>>;

	public abstract getList(
		sell_currency_id: number,
		buy_currency_id: number,
		ignore_guild_member_id: number,
		page: number
	): Promise<PaginationType<ExchangeProposalEntity>>;

	public abstract save(entity: ExchangeProposalEntity): Promise<ExchangeProposalEntity>;
	public abstract delete(entity: ExchangeProposalEntity): Promise<void>;
}

export type ExchangeProposalModel = {
	id: number;
	guild_member_id: number;
	sell_currency_id: number;
	sell_amount: number;
	buy_currency_id: number;
	buy_amount: number;
};

export class ExchangeProposalEntity extends Entity<
	ExchangeProposalModel,
	ExchangeProposalRepository
> {
	public get guild_member_id(): number {
		return this.__model.guild_member_id;
	}

	public get sell_currency_id(): number {
		return this.__model.sell_currency_id;
	}

	public get sell_amount(): number {
		return this.__model.sell_amount;
	}

	public get buy_currency_id(): number {
		return this.__model.buy_currency_id;
	}

	public get buy_amount(): number {
		return this.__model.buy_amount;
	}
}
