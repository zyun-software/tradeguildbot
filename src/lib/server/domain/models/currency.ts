import { Entity, RepositoryId, type RepositorySave } from '$lib/server/core';

export abstract class CurrencyRepository
	extends RepositoryId<CurrencyEntity>
	implements RepositorySave<CurrencyEntity>
{
	public abstract updateGuildId(entity: CurrencyEntity): Promise<void>;
	public abstract updateCode(entity: CurrencyEntity): Promise<void>;
	public abstract updateName(entity: CurrencyEntity): Promise<void>;

	public abstract findByCode(code: string): Promise<CurrencyEntity | null>;
	public abstract getListByGuildId(id: number): Promise<CurrencyEntity[]>;
	public abstract save(entity: CurrencyEntity): Promise<CurrencyEntity>;
	public abstract delete(entity: CurrencyEntity): Promise<void>;
}

export class CurrencyDefaultValue {
	public static guild_id: number = -1;
	public static code: string = '';
	public static _name: string = '';
}

export type CurrencyModel = {
	id: number;
	guild_id: number;
	code: string;
	name: string;
	capital: number;
};

export class CurrencyEntity extends Entity<CurrencyModel, CurrencyRepository> {
	public get guild_id(): number {
		return this.__model.guild_id;
	}

	public async setGuildId(value: number): Promise<CurrencyEntity> {
		this.__model.guild_id = value;
		if (this.__created) {
			await this.__repository.updateGuildId(this);
		}

		return this;
	}

	public get code(): string {
		return this.__model.code;
	}

	public async setCode(value: string): Promise<CurrencyEntity> {
		this.__model.code = value;
		if (this.__created) {
			await this.__repository.updateCode(this);
		}

		return this;
	}

	public get name(): string {
		return this.__model.name;
	}

	public async setName(value: string): Promise<CurrencyEntity> {
		this.__model.name = value;
		if (this.__created) {
			await this.__repository.updateName(this);
		}

		return this;
	}

	public get capital(): number {
		return this.__model.capital;
	}
}
