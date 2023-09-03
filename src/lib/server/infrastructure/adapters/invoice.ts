import { InvoiceEntity, InvoiceRepository, type InvoiceModel } from '$lib/server/domain';
import { sql } from '../api';

const table = 'invoices';

export class InvoiceAdapter extends InvoiceRepository {
	public async updatePaid(entity: InvoiceEntity): Promise<InvoiceEntity> {
		const { id, paid } = entity;

		const models = await sql<InvoiceModel[]>`
			UPDATE ${sql(table)}
			SET paid = ${paid}
			WHERE id = ${id}
			RETURNING *
		`;

		const result = this._find(models);

		if (!result) {
			throw new Error('Помилка оновлення платіжної інформації');
		}

		return result;
	}

	public async save(entity: InvoiceEntity): Promise<InvoiceEntity> {
		const { id, seller_account_id, payer_account_id, amount, purpose, paid, _created } = entity;

		const models = await (_created
			? sql<InvoiceModel[]>`
				UPDATE ${sql(table)}
				SET seller_account_id = ${seller_account_id},
					payer_account_id = ${payer_account_id},
					amount = ${amount},
					purpose = ${purpose},
					paid = ${paid}
				WHERE id = ${id}
				RETURNING *
			`
			: sql<InvoiceModel[]>`
				INSERT INTO ${sql(table)}
					(seller_account_id, payer_account_id, amount, purpose, paid)
				VALUES
					(${seller_account_id}, ${payer_account_id}, ${amount}, ${purpose}, ${paid})
				RETURNING *
			`);

		const result = this._find(models);

		if (!result) {
			throw new Error('Помилка збереження інвойсу');
		}

		return result;
	}

	public async findById(id: number): Promise<InvoiceEntity | null> {
		const models = await sql<InvoiceModel[]>`
			SELECT *
			FROM ${sql(table)}
			WHERE id = ${id}
    `;

		const result = this._find(models);

		return result;
	}

	public async delete(entity: InvoiceEntity): Promise<void> {
		const { id } = entity;

		await sql`
      DELETE FROM ${sql(table)}
      WHERE id = ${id}
    `;
	}

	public async countByAccountIds(
		seller_account_id: number,
		payer_account_id: number
	): Promise<number> {
		const result = await sql<{ count: number }[]>`
			SELECT COUNT(*) as count
			FROM ${sql(table)}
			WHERE seller_account_id = ${seller_account_id}
				AND payer_account_id = ${payer_account_id}
		`;

		const count = result[0]?.count ?? 0;

		return count;
	}

	private _mapper(row: InvoiceModel): InvoiceModel {
		return {
			...row,
			seller_account_id: parseInt(row.seller_account_id.toString()),
			payer_account_id: parseInt(row.payer_account_id.toString())
		};
	}

	private _list(models: InvoiceModel[]): InvoiceEntity[] {
		const entities = models.map(
			(model) => new InvoiceEntity({ model: this._mapper(model), repository: this })
		);

		return entities;
	}

	private _find(models: InvoiceModel[]): InvoiceEntity | null {
		if (!models.length) {
			return null;
		}

		const entity = new InvoiceEntity({ model: this._mapper(models[0]), repository: this });

		return entity;
	}
}
