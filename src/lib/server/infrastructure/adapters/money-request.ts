import {
	MoneyRequestEntity,
	MoneyRequestRepository,
	type MoneyRequestModel
} from '$lib/server/domain';
import { sql } from '../api';

const table = 'money_request';

export class MoneyRequestAdapter extends MoneyRequestRepository {
	public async findById(id: number): Promise<MoneyRequestEntity | null> {
		const models = await sql<MoneyRequestModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE id = ${id}
    `;

		const result = this._find(models);

		return result;
	}

	public async findByAccountId(id: number): Promise<MoneyRequestEntity | null> {
		const models = await sql<MoneyRequestModel[]>`
      SELECT *
      FROM ${sql(table)}
      WHERE account_id = ${id}
    `;

		const result = this._find(models);

		return result;
	}

	public async save(entity: MoneyRequestEntity): Promise<MoneyRequestEntity> {
		const { id, account_id, type, amount, _created } = entity;

		const models = await (_created
			? sql<MoneyRequestModel[]>`
          UPDATE ${sql(table)}
          SET account_id = ${account_id}, type = ${type}, amount = ${amount}
          WHERE id = ${id}
          RETURNING *`
			: sql<MoneyRequestModel[]>`
          INSERT INTO ${sql(table)}
          (account_id, type, amount)
          VALUES
          (${account_id}, ${type}, ${amount})
          RETURNING *`);

		const result = this._find(models);

		if (!result) {
			throw new Error('Помилка збереження запиту на гроші');
		}

		return result;
	}

	public async delete(entity: MoneyRequestEntity): Promise<void> {
		const { id } = entity;

		await sql`
      DELETE FROM ${sql(table)}
      WHERE id = ${id}
    `;
	}

	private _mapper(row: MoneyRequestModel): MoneyRequestModel {
		return {
			...row,
			account_id: parseInt(row.account_id.toString())
		};
	}

	private _find(models: MoneyRequestModel[]): MoneyRequestEntity | null {
		if (!models.length) {
			return null;
		}

		const entity = new MoneyRequestEntity({
			model: this._mapper(models[0]),
			repository: this
		});

		return entity;
	}
}
