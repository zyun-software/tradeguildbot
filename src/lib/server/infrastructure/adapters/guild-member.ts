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

	public async getApprovedListByUserId(id: number): Promise<GuildMemberEntity[]> {
		const models = await sql<GuildMemberModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE user_id = ${id} AND approved = true
    `;

		const entities = models.map(
			(model) => new GuildMemberEntity({ model: this._mapper(model), repository: this })
		);

		return entities;
	}

	public async save(entity: GuildMemberEntity): Promise<GuildMemberEntity> {
		const { id, user_id, guild_id, name, approved, _created } = entity;

		const query = _created
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
          (id, user_id, guild_id, name, approved)
        VALUES
          (${id}, ${user_id}, ${guild_id}, ${name}, ${approved})
        ON CONFLICT (id) DO UPDATE
          SET user_id = EXCLUDED.user_id,
            guild_id = EXCLUDED.guild_id,
            name = EXCLUDED.name,
            approved = EXCLUDED.approved
        RETURNING *`;

		const models = await query;

		if (!models.length) {
			throw new Error('Помилка збереження учасника гільдії');
		}

		const result = new GuildMemberEntity({ model: this._mapper(models[0]), repository: this });

		return result;
	}

	public async findById(id: number): Promise<GuildMemberEntity | null> {
		const models = await sql<GuildMemberModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE id = ${id}
    `;

		if (!models.length) {
			return null;
		}

		const entity = new GuildMemberEntity({ model: this._mapper(models[0]), repository: this });

		return entity;
	}

	private _mapper(row: GuildMemberModel): GuildMemberModel {
		return {
			...row,
			user_id: parseInt(row.user_id.toString()),
			guild_id: parseInt(row.guild_id.toString())
		};
	}
}
