import { Entity, RepositoryId, type RepositorySave } from '$lib/server/core';

export abstract class GuildMemberRepository
	extends RepositoryId<GuildMemberEntity>
	implements RepositorySave<GuildMemberEntity>
{
	public abstract updateName(entity: GuildMemberEntity): Promise<void>;
	public abstract updateApproved(entity: GuildMemberEntity): Promise<void>;

	public abstract findByUserIdAndGuildId(
		user_id: number,
		guild_id: number
	): Promise<GuildMemberEntity | null>;

	public abstract getByUserIdAndGuildId(
		user_id: number,
		guild_id: number
	): Promise<GuildMemberEntity>;

	public abstract findByNameAndGuildId(
		name: string,
		guild_id: number
	): Promise<GuildMemberEntity | null>;

	public abstract getListByUserId(id: number): Promise<GuildMemberEntity[]>;
	public abstract getApprovedListByGuildId(id: number): Promise<GuildMemberEntity[]>;
	public abstract getNotApprovedListByGuildIdAndName(
		guild_id: number,
		name: string
	): Promise<GuildMemberEntity[]>;
	public abstract save(entity: GuildMemberEntity): Promise<GuildMemberEntity>;
	public abstract delete(entity: GuildMemberEntity): Promise<void>;
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

	public get guild_id(): number {
		return this.__model.guild_id;
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
