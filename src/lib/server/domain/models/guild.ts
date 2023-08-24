import { Entity, type RepositorySave } from '$lib/server/core';

export abstract class GuildRepository implements RepositorySave<GuildEntity> {
	public abstract updateName(entity: GuildEntity): Promise<void>;
	public abstract updateOwnerId(entity: GuildEntity): Promise<void>;
	public abstract updateActive(entity: GuildEntity): Promise<void>;

	public abstract findById(id: number): Promise<GuildEntity | null>;
	public abstract findByOwnerId(id: number): Promise<GuildEntity | null>;
	public abstract save(entity: GuildEntity): Promise<GuildEntity>;
}

export class GuildDefaultValue {
	public static _name: string = '';
	public static owner_id: number = -1;
	public static active: boolean = false;
}

export type GuildModel = {
	id: number;
	name: string;
	owner_id: number;
	active: boolean;
};

export class GuildEntity extends Entity<GuildModel, GuildRepository> {
	public get name(): string {
		return this.__model.name;
	}

	public async setName(value: string): Promise<GuildEntity> {
		this.__model.name = value;
		if (this.__created) {
			await this.__repository.updateName(this);
		}

		return this;
	}

	public get owner_id(): number {
		return this.__model.owner_id;
	}

	public async setOwnerId(value: number): Promise<GuildEntity> {
		this.__model.owner_id = value;
		if (this.__created) {
			await this.__repository.updateOwnerId(this);
		}

		return this;
	}

	public get active(): boolean {
		return this.__model.active;
	}

	public async setActive(value: boolean): Promise<GuildEntity> {
		this.__model.active = value;
		if (this.__created) {
			await this.__repository.updateActive(this);
		}

		return this;
	}
}
