import { itemsPerPage, type PaginationType } from '$lib/server/core';
import {
	AnnouncementEntity,
	AnnouncementRepository,
	GuildMemberEntity,
	GuildMemberRepository,
	type AnnouncementModel
} from '$lib/server/domain';
import { sql } from '../api';

const table = 'announcements';

export class AnnouncementAdapter extends AnnouncementRepository {
	public constructor(private _guildMemberRepository: GuildMemberRepository) {
		super();
	}

	public async getGuildMember(entity: AnnouncementEntity): Promise<GuildMemberEntity> {
		const result = await this._guildMemberRepository.getById(entity.guild_member_id);

		return result;
	}

	public async updateTitle(entity: AnnouncementEntity): Promise<AnnouncementEntity> {
		const { id, title } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET title = ${title}
      WHERE id = ${id}
    `;

		return entity;
	}

	public async updateDescription(entity: AnnouncementEntity): Promise<AnnouncementEntity> {
		const { id, description } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET description = ${description}
      WHERE id = ${id}
    `;

		return entity;
	}

	public async updateSeller(entity: AnnouncementEntity): Promise<AnnouncementEntity> {
		const { id, seller } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET seller = ${seller}
      WHERE id = ${id}
    `;

		return entity;
	}

	public async save(entity: AnnouncementEntity): Promise<AnnouncementEntity> {
		const { id, guild_member_id, title, description, seller, _created } = entity;

		const models = await (_created
			? sql<AnnouncementModel[]>`
        UPDATE ${sql(table)}
        SET guild_member_id = ${guild_member_id},
          title = ${title},
          description = ${description},
          seller = ${seller}
        WHERE id = ${id}
        RETURNING *`
			: sql<AnnouncementModel[]>`
        INSERT INTO ${sql(table)}
          (guild_member_id, title, description, seller)
        VALUES
          (${guild_member_id}, ${title}, ${description}, ${seller})
        RETURNING *`);

		const result = this._find(models);

		if (!result) {
			throw new Error('Помилка збереження оголошення');
		}

		return result;
	}

	public async delete(entity: AnnouncementEntity): Promise<void> {
		const { id } = entity;

		await sql`
			DELETE FROM ${sql(table)}
			WHERE id = ${id}
		`;
	}

	public async findById(id: number): Promise<AnnouncementEntity | null> {
		const models = await sql<AnnouncementModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE id = ${id}
    `;

		const result = this._find(models);

		return result;
	}

	public async getUniqueTitleList(guild_id: number): Promise<string[]> {
		const result = await sql<{ title: string }[]>`
			SELECT DISTINCT a.title
			FROM ${sql(table)} a
			INNER JOIN guild_members gm ON a.guild_member_id = gm.id
			WHERE gm.guild_id = ${guild_id}
			ORDER BY a.title`;

		const uniqueTitles = result.map((row) => row.title);

		return uniqueTitles;
	}

	public async getByGuildMemberIdList(
		guild_member_id: number,
		page: number
	): Promise<PaginationType<AnnouncementEntity>> {
		const offset = (page - 1) * itemsPerPage;

		const result = await sql<AnnouncementModel[]>`
			SELECT *
			FROM ${sql(table)} AS a
			WHERE a.guild_member_id = ${guild_member_id}
			ORDER BY a.title
			OFFSET ${offset}
			LIMIT ${itemsPerPage + 1}`;

		const items = this._list(result.slice(0, itemsPerPage));
		const nextPage = result.length > itemsPerPage;

		return {
			items,
			page,
			next: nextPage
		};
	}

	private _mapper(row: AnnouncementModel): AnnouncementModel {
		return {
			...row,
			guild_member_id: parseInt(row.guild_member_id.toString())
		};
	}

	private _list(models: AnnouncementModel[]): AnnouncementEntity[] {
		const entities = models.map(
			(model) => new AnnouncementEntity({ model: this._mapper(model), repository: this })
		);

		return entities;
	}

	private _find(models: AnnouncementModel[]): AnnouncementEntity | null {
		if (!models.length) {
			return null;
		}

		const entity = new AnnouncementEntity({ model: this._mapper(models[0]), repository: this });

		return entity;
	}
}
