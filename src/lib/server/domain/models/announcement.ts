import { Entity, RepositoryId, type PaginationType, type RepositorySave } from '$lib/server/core';
import { capitalizeFirstLetterUtility } from '../utilities';
import type { GuildMemberEntity } from './guild-member';

export type AnnouncementModel = {
	id: number;
	guild_member_id: number;
	title: string;
	description: string;
	seller: string;
};

export abstract class AnnouncementRepository
	extends RepositoryId<AnnouncementEntity>
	implements RepositorySave<AnnouncementEntity>
{
	public abstract updateTitle(entity: AnnouncementEntity): Promise<AnnouncementEntity>;
	public abstract updateDescription(entity: AnnouncementEntity): Promise<AnnouncementEntity>;
	public abstract updateSeller(entity: AnnouncementEntity): Promise<AnnouncementEntity>;

	public abstract getUniqueTitleList(guild_id: number): Promise<string[]>;
	public abstract getByGuildMemberIdList(
		guild_member_id: number,
		page: number
	): Promise<PaginationType<AnnouncementEntity>>;

	public abstract getGuildMember(entity: AnnouncementEntity): Promise<GuildMemberEntity>;

	public abstract save(entity: AnnouncementEntity): Promise<AnnouncementEntity>;
	public abstract delete(entity: AnnouncementEntity): Promise<void>;
}

export class AnnouncementEntity extends Entity<AnnouncementModel, AnnouncementRepository> {
	private _regex = /https:\/\/t\.me\/\w+\/\d+/;

	public get guild_member_id(): number {
		return this.__model.guild_member_id;
	}

	public get title(): string {
		return this.__model.title;
	}

	private set _title(value: string) {
		if (value.length < 3) {
			throw new Error('Назва занадто коротка');
		}

		value = value.replace(/\s+/g, ' ').trim();
		const maxLength = 255;
		value = value.length > maxLength ? value.substring(0, maxLength) : value;
		value = capitalizeFirstLetterUtility(value);

		this.__model.title = value;
	}

	public async setTitle(value: string): Promise<AnnouncementEntity> {
		this._title = value;
		if (this.__created) {
			await this.__repository.updateTitle(this);
		}

		return this;
	}

	public get description(): string {
		return this.__model.description;
	}

	private set _description(value: string) {
		if (!this._regex.test(value)) {
			throw new Error('В поле опис потрібно вставити посилання на пост Telegram');
		}

		this.__model.description = value;
	}

	public async setDescription(value: string): Promise<AnnouncementEntity> {
		this._description = value;
		if (this.__created) {
			await this.__repository.updateDescription(this);
		}

		return this;
	}

	public get seller(): string {
		return this.__model.seller;
	}

	private set _seller(value: string) {
		if (!this._regex.test(value)) {
			throw new Error('В поле продавець потрібно вставити посилання на пост Telegram');
		}

		this.__model.seller = value;
	}

	public async setSeller(value: string): Promise<AnnouncementEntity> {
		this.__model.seller = value;
		if (this.__created) {
			await this.__repository.updateSeller(this);
		}

		return this;
	}

	public async getGuildMember(): Promise<GuildMemberEntity> {
		const entity = await this.__repository.getGuildMember(this);

		return entity;
	}

	public constructor(options: { model: AnnouncementModel; repository: AnnouncementRepository }) {
		super(options);

		this._title = options.model.title;
		this._description = options.model.description;
		this._seller = options.model.seller;
	}
}
