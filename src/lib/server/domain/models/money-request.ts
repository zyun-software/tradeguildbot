import { Entity, RepositoryId, type RepositorySave } from '$lib/server/core';

type MoneyRequestType = 'introduction' | 'receiving';

export type MoneyRequestModel = {
	id: number;
	account_id: number;
	transaction_type: MoneyRequestType;
	amount: number;
};

export abstract class MoneyRequestRepository
	extends RepositoryId<MoneyRequestEntity>
	implements RepositorySave<MoneyRequestEntity>
{
	public abstract findByAccountId(id: number): Promise<MoneyRequestEntity | null>;
	public abstract save(entity: MoneyRequestEntity): Promise<MoneyRequestEntity>;
	public abstract delete(entity: MoneyRequestEntity): Promise<void>;
}

export class MoneyRequestDefaultValue {
	public static account_id: number = -1;
	public static type: MoneyRequestType = 'introduction';
	public static amount: number = 0;
}

export class MoneyRequestEntity extends Entity<MoneyRequestModel, MoneyRequestRepository> {
	public get account_id(): number {
		return this.__model.account_id;
	}

	public get type(): MoneyRequestType {
		return this.__model.transaction_type;
	}

	public get amount(): number {
		return this.__model.amount;
	}
}
