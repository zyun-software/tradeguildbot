import { Entity, type RepositorySave } from '$lib/server/core';

export abstract class GuildMemberRepository implements RepositorySave<GuildMemberEntity> {
	public abstract updateUserId(entity: GuildMemberEntity): Promise<void>;
	public abstract updateGuildId(entity: GuildMemberEntity): Promise<void>;
	public abstract updateName(entity: GuildMemberEntity): Promise<void>;
	public abstract updateApproved(entity: GuildMemberEntity): Promise<void>;

	public abstract save(entity: GuildMemberEntity): Promise<GuildMemberEntity>;
}

export class GuildMemberDefaultValue {
	public static user_id: number = -1;
	public static guild_id: number = -1;
	public static _name: string = '';
	public static approved: boolean = false;
}

export type GuildMemberModel = {
	id: number;
	user_id: number;
	guild_id: number;
	name: string;
	approved: boolean;
};

export class GuildMemberEntity extends Entity<GuildMemberModel, GuildMemberRepository> {
	public get user_id(): number {
		return this.__model.user_id;
	}

	public async setUserId(value: number): Promise<GuildMemberEntity> {
		this.__model.user_id = value;
		if (this.__created) {
			await this.__repository.updateUserId(this);
		}

		return this;
	}

	public get guild_id(): number {
		return this.__model.guild_id;
	}

	public async setGuildId(value: number): Promise<GuildMemberEntity> {
		this.__model.guild_id = value;
		if (this.__created) {
			await this.__repository.updateGuildId(this);
		}

		return this;
	}

	public get name(): string {
		return this.__model.name;
	}

	public async setName(value: string): Promise<GuildMemberEntity> {
		this.__model.name = value;
		if (this.__created) {
			await this.__repository.updateName(this);
		}

		return this;
	}

	public get approved(): boolean {
		return this.__model.approved;
	}

	public async setApproved(value: boolean): Promise<GuildMemberEntity> {
		this.__model.approved = value;
		if (this.__created) {
			await this.__repository.updateApproved(this);
		}

		return this;
	}
}
