import { CurrencyEntity, CurrencyRepository, type CurrencyModel } from '$lib/server/domain';
import { sql } from '../api';

const table = 'currencies';

export class CurrencyAdapter extends CurrencyRepository {
	public async updateGuildId(entity: CurrencyEntity): Promise<void> {
		const { id, guild_id } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET guild_id = ${guild_id}
			WHERE id = ${id}
		`;
	}

	public async updateCode(entity: CurrencyEntity): Promise<void> {
		const { id, code } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET code = ${code}
			WHERE id = ${id}
		`;
	}

	public async updateName(entity: CurrencyEntity): Promise<void> {
		const { id, name } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET name = ${name}
			WHERE id = ${id}
		`;
	}

	public async findById(id: number): Promise<CurrencyEntity | null> {
		const models = await sql<CurrencyModel[]>`
      SELECT c.*, CAST(COALESCE(SUM(a.reserve + a.balance), 0) AS INTEGER) AS capital
      FROM ${sql(table)} c
      LEFT JOIN accounts a ON c.id = a.currency_id
      WHERE c.id = ${id}
      GROUP BY c.id
    `;

		const result = this._find(models);

		return result;
	}

	public async findByCode(code: string): Promise<CurrencyEntity | null> {
		const models = await sql<CurrencyModel[]>`
      SELECT c.*, CAST(COALESCE(SUM(a.reserve + a.balance), 0) AS INTEGER) AS capital
      FROM ${sql(table)} c
      LEFT JOIN accounts a ON c.id = a.currency_id
      WHERE LOWER(c.code) = LOWER(${code})
      GROUP BY c.id
    `;

		const result = this._find(models);

		return result;
	}

	public async getListByGuildId(id: number): Promise<CurrencyEntity[]> {
		const models = await sql<CurrencyModel[]>`
      SELECT c.*, CAST(COALESCE(SUM(a.reserve + a.balance), 0) AS INTEGER) AS capital
			FROM ${sql(table)} c
			LEFT JOIN accounts a ON c.id = a.currency_id
			WHERE c.guild_id = ${id}
			GROUP BY c.id
		`;

		const entities = this._list(models);

		return entities;
	}

	public async save(entity: CurrencyEntity): Promise<CurrencyEntity> {
		const { id, guild_id, code, name, _created } = entity;

		const query = _created
			? sql<CurrencyModel[]>`
				UPDATE ${sql(table)}
				SET guild_id = ${guild_id}, code = ${code}, name = ${name}
				WHERE id = ${id}
				RETURNING *`
			: sql<CurrencyModel[]>`
				INSERT INTO ${sql(table)}
				(guild_id, code, name)
				VALUES
				(${guild_id}, ${code}, ${name})
				RETURNING *`;

		const models = await query;

		if (!models.length) {
			throw new Error('Помилка збереження валюти');
		}

		const result = new CurrencyEntity({ model: this._mapper(models[0]), repository: this });

		return result;
	}

	public async delete(entity: CurrencyEntity): Promise<void> {
		const { id } = entity;

		await sql`
      DELETE FROM ${sql(table)}
      WHERE id = ${id}
    `;
	}

	private _mapper(row: CurrencyModel): CurrencyModel {
		return {
			...row,
			guild_id: parseInt(row.guild_id.toString())
		};
	}

	private _list(models: CurrencyModel[]): CurrencyEntity[] {
		const entities = models.map(
			(model) => new CurrencyEntity({ model: this._mapper(model), repository: this })
		);

		return entities;
	}

	private _find(models: CurrencyModel[]): CurrencyEntity | null {
		if (!models.length) {
			return null;
		}

		const entity = new CurrencyEntity({ model: this._mapper(models[0]), repository: this });

		return entity;
	}
}
