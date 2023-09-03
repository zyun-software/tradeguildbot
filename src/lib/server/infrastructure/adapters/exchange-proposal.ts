import {
	ExchangeProposalEntity,
	ExchangeProposalRepository,
	type ExchangeProposalModel
} from '$lib/server/domain';
import { sql } from '../api';

const table = 'exchange_proposals';

export class ExchangeProposalAdapter extends ExchangeProposalRepository {
	public async save(entity: ExchangeProposalEntity): Promise<ExchangeProposalEntity> {
		const {
			id,
			guild_member_id,
			sell_currency_id,
			sell_amount,
			buy_currency_id,
			buy_amount,
			_created
		} = entity;

		const models = await (_created
			? sql<ExchangeProposalModel[]>`
        UPDATE ${sql(table)}
        SET
          guild_member_id = ${guild_member_id},
          sell_currency_id = ${sell_currency_id},
          sell_amount = ${sell_amount},
          buy_currency_id = ${buy_currency_id},
          buy_amount = ${buy_amount}
        WHERE id = ${id}
        RETURNING *`
			: sql<ExchangeProposalModel[]>`
        INSERT INTO ${sql(table)}
          (guild_member_id, sell_currency_id, sell_amount, buy_currency_id, buy_amount)
        VALUES
          (${guild_member_id}, ${sell_currency_id}, ${sell_amount}, ${buy_currency_id}, ${buy_amount})
        RETURNING *`);

		const result = this._find(models);

		if (!result) {
			throw new Error('Помилка збереження обмінної пропозиції');
		}

		return result;
	}

	public async findById(id: number): Promise<ExchangeProposalEntity | null> {
		const models = await sql<ExchangeProposalModel[]>`
			SELECT *
			FROM ${sql(table)}
			WHERE id = ${id}
    `;

		const result = this._find(models);

		return result;
	}

	public async getListByGuildMemberId(guild_member_id: number): Promise<ExchangeProposalEntity[]> {
		const models = await sql<ExchangeProposalModel[]>`
        SELECT *
        FROM ${sql(table)}
        WHERE guild_member_id = ${guild_member_id}
    `;

		const entities = this._list(models);

		return entities;
	}

	public async delete(entity: ExchangeProposalEntity): Promise<void> {
		const { id } = entity;

		await sql`
      DELETE FROM ${sql(table)}
      WHERE id = ${id}
    `;
	}

	private _mapper(row: ExchangeProposalModel): ExchangeProposalModel {
		return {
			...row,
			guild_member_id: parseInt(row.guild_member_id.toString()),
			sell_currency_id: parseInt(row.sell_currency_id.toString()),
			buy_currency_id: parseInt(row.buy_currency_id.toString())
		};
	}

	private _list(models: ExchangeProposalModel[]): ExchangeProposalEntity[] {
		const entities = models.map(
			(model) => new ExchangeProposalEntity({ model: this._mapper(model), repository: this })
		);

		return entities;
	}

	private _find(models: ExchangeProposalModel[]): ExchangeProposalEntity | null {
		if (!models.length) {
			return null;
		}

		const entity = new ExchangeProposalEntity({ model: this._mapper(models[0]), repository: this });

		return entity;
	}
}
