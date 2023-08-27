import {
	GuildMemberEntity,
	GuildMemberRepository,
	type GuildMemberModel
} from '$lib/server/domain';
import { sql } from '../api';

const table = 'guild_members';

export class GuildMemberAdapter extends GuildMemberRepository {
	public async updateUserId(entity: GuildMemberEntity): Promise<void> {
		const { id, user_id } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET user_id = ${user_id}
      WHERE id = ${id}
    `;
	}

	public async updateGuildId(entity: GuildMemberEntity): Promise<void> {
		const { id, guild_id } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET guild_id = ${guild_id}
      WHERE id = ${id}
    `;
	}

	public async updateName(entity: GuildMemberEntity): Promise<void> {
		const { id, name } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET name = ${name}
      WHERE id = ${id}
    `;
	}

	public async updateApproved(entity: GuildMemberEntity): Promise<void> {
		const { id, approved } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET approved = ${approved}
      WHERE id = ${id}
    `;
	}

	public async findByUserIdAndGuildId(
		user_id: number,
		guild_id: number
	): Promise<GuildMemberEntity | null> {
		const models = await sql<GuildMemberModel[]>`
			SELECT *
			FROM ${sql(table)}
			WHERE user_id = ${user_id} AND guild_id = ${guild_id}
		`;

		const result = this._find(models);

		return result;
	}

	public async findByNameAndGuildId(
		name: string,
		guild_id: number
	): Promise<GuildMemberEntity | null> {
		const models = await sql<GuildMemberModel[]>`
			SELECT *
			FROM ${sql(table)}
			WHERE LOWER(name) = LOWER(${name}) AND guild_id = ${guild_id}
		`;

		const result = this._find(models);

		return result;
	}

	public async getNotApprovedListByGuildIdAndName(
		guild_id: number,
		name: string
	): Promise<GuildMemberEntity[]> {
		const lowerCaseName = name.toLowerCase();

		const models = await sql<GuildMemberModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE guild_id = ${guild_id} AND LOWER(name) LIKE ${`%${lowerCaseName}%`} AND approved = false
			ORDER BY name DESC
    `;

		const entities = this._list(models);

		return entities;
	}

	public async getListByUserId(id: number): Promise<GuildMemberEntity[]> {
		const models = await sql<GuildMemberModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE user_id = ${id}
    `;

		const entities = this._list(models);

		return entities;
	}

	public async getApprovedListByGuildId(id: number): Promise<GuildMemberEntity[]> {
		const models = await sql<GuildMemberModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE guild_id = ${id} AND approved = true
    `;

		const entities = this._list(models);

		return entities;
	}

	public async save(entity: GuildMemberEntity): Promise<GuildMemberEntity> {
		const { id, user_id, guild_id, name, approved, _created } = entity;

		const models = await (_created
			? sql<GuildMemberModel[]>`
				UPDATE ${sql(table)}
				SET user_id = ${user_id},
					guild_id = ${guild_id},
					name = ${name},
					approved = ${approved}
				WHERE id = ${id}
				RETURNING *`
			: sql<GuildMemberModel[]>`
        INSERT INTO ${sql(table)}
          (user_id, guild_id, name, approved)
        VALUES
          (${user_id}, ${guild_id}, ${name}, ${approved})
        RETURNING *`);

		const result = this._find(models);

		if (!result) {
			throw new Error('Помилка збереження учасника гільдії');
		}

		return result;
	}

	public async delete(entity: GuildMemberEntity): Promise<void> {
		const { id } = entity;

		await sql`
			DELETE FROM ${sql(table)}
			WHERE id = ${id}
		`;
	}

	public async findById(id: number): Promise<GuildMemberEntity | null> {
		const models = await sql<GuildMemberModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE id = ${id}
    `;

		const result = this._find(models);

		return result;
	}

	private _mapper(row: GuildMemberModel): GuildMemberModel {
		return {
			...row,
			user_id: parseInt(row.user_id.toString()),
			guild_id: parseInt(row.guild_id.toString())
		};
	}

	private _list(models: GuildMemberModel[]): GuildMemberEntity[] {
		const entities = models.map(
			(model) => new GuildMemberEntity({ model: this._mapper(model), repository: this })
		);

		return entities;
	}

	private _find(models: GuildMemberModel[]): GuildMemberEntity | null {
		if (!models.length) {
			return null;
		}

		const entity = new GuildMemberEntity({ model: this._mapper(models[0]), repository: this });

		return entity;
	}
}
