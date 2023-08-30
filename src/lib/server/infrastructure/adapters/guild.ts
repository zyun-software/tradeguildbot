import { GuildEntity, GuildRepository, type GuildModel } from '$lib/server/domain';
import { sql } from '../api';

const table = 'guilds';

export class GuildAdapter extends GuildRepository {
	public async updateName(entity: GuildEntity): Promise<void> {
		const { id, name } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET name = ${name}
      WHERE id = ${id}
    `;
	}

	public async updateOwnerId(entity: GuildEntity): Promise<void> {
		const { id, owner_id } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET owner_id = ${owner_id}
      WHERE id = ${id}
    `;
	}

	public async updateActive(entity: GuildEntity): Promise<void> {
		const { id, active } = entity;

		await sql`
      UPDATE ${sql(table)}
      SET active = ${active}
      WHERE id = ${id}
    `;
	}

	public async findByOwnerId(id: number): Promise<GuildEntity | null> {
		const models = await sql<GuildModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE owner_id = ${id}
    `;

		if (!models.length) {
			return null;
		}

		const entity = new GuildEntity({
			model: this._mapper(models[0]),
			repository: this
		});

		return entity;
	}

	public async getActiveList(): Promise<GuildEntity[]> {
		const models = await sql<GuildModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE active = true
    `;

		const entities = models.map(
			(model) => new GuildEntity({ model: this._mapper(model), repository: this })
		);

		return entities;
	}

	public async delete(entity: GuildEntity): Promise<void> {
		const { id } = entity;

		await sql`
		    DELETE FROM ${sql(table)}
		    WHERE id = ${id}
		`;
	}

	public async save(entity: GuildEntity): Promise<GuildEntity> {
		const { id, name, owner_id, active, _created } = entity;

		const models = await (_created
			? sql<GuildModel[]>`
					UPDATE ${sql(table)}
					SET name = ${name},
						owner_id = ${owner_id},
						active = ${active}
					WHERE id = ${id}
					RETURNING *
				`
			: sql<GuildModel[]>`
				INSERT INTO ${sql(table)}
					(name, owner_id, active)
				VALUES
					(${name}, ${owner_id}, ${active})
				RETURNING *
			`);

		const result = this._find(models);

		if (!result) {
			throw new Error('Помилка збереження гільдії');
		}

		return result;
	}

	public async findById(id: number): Promise<GuildEntity | null> {
		const models = await sql<GuildModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE id = ${id}
    `;

		const result = this._find(models);

		return result;
	}

	private _mapper(row: GuildModel): GuildModel {
		return {
			...row,
			owner_id: parseInt(row.owner_id.toString())
		};
	}

	private _find(models: GuildModel[]): GuildEntity | null {
		if (!models.length) {
			return null;
		}

		const entity = new GuildEntity({ model: this._mapper(models[0]), repository: this });

		return entity;
	}
}
