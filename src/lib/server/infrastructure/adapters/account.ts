import { AccountEntity, AccountRepository, type AccountModel } from '$lib/server/domain';
import { sql } from '../api';

const table = 'accounts';

export class AccountAdapter extends AccountRepository {
	public async updateBalance(entity: AccountEntity): Promise<void> {
		const { id, balance } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET balance = ${balance}
			WHERE id = ${id}
		`;
	}

	public async updateReserve(entity: AccountEntity): Promise<void> {
		const { id, reserve } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET reserve = ${reserve}
			WHERE id = ${id}
		`;
	}

	public async updateMoneyRequest(entity: AccountEntity): Promise<void> {
		const { id, money_request } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET money_request = ${money_request}
			WHERE id = ${id}
		`;
	}

	public async updateMoneyRequestType(entity: AccountEntity): Promise<void> {
		const { id, money_request_type } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET money_request_type = ${money_request_type}
			WHERE id = ${id}
		`;
	}

	public async updateMoneyRequestAmount(entity: AccountEntity): Promise<void> {
		const { id, money_request_amount } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET money_request_amount = ${money_request_amount}
			WHERE id = ${id}
		`;
	}

	public async findByGuildMemberIdAndCurrencyId(
		guild_member_id: number,
		currency_id: number
	): Promise<AccountEntity | null> {
		const models = await sql<AccountModel[]>`
			SELECT *
			FROM ${sql(table)}
			WHERE guild_member_id = ${guild_member_id} AND currency_id = ${currency_id}
		`;

		const result = this._find(models);

		return result;
	}

	public async save(entity: AccountEntity): Promise<AccountEntity> {
		const {
			id,
			guild_member_id,
			currency_id,
			balance,
			reserve,
			money_request,
			money_request_type,
			money_request_amount,
			_created
		} = entity;

		const models = await (_created
			? sql<AccountModel[]>`
				UPDATE ${sql(table)}
				  SET guild_member_id = ${guild_member_id},
            currency_id = ${currency_id},
            balance = ${balance},
            reserve = ${reserve},
						money_request = ${money_request},
						money_request_type = ${money_request_type},
						money_request_amount = ${money_request_amount}
				WHERE id = ${id}
				RETURNING *`
			: sql<AccountModel[]>`
        INSERT INTO ${sql(table)}
          (guild_member_id, currency_id, balance, reserve, money_request, money_request_type, money_request_amount)
        VALUES
          (${guild_member_id}, ${currency_id}, ${balance}, ${reserve}, ${money_request}, ${money_request_type}, ${money_request_amount})
        RETURNING *`);

		const result = this._find(models);

		if (!result) {
			throw new Error('Помилка збереження рахунку');
		}

		return result;
	}

	private _mapper(row: AccountModel): AccountModel {
		return {
			...row,
			guild_member_id: parseInt(row.guild_member_id.toString()),
			currency_id: parseInt(row.currency_id.toString())
		};
	}

	private _find(models: AccountModel[]): AccountEntity | null {
		if (!models.length) {
			return null;
		}

		const entity = new AccountEntity({ model: this._mapper(models[0]), repository: this });

		return entity;
	}
}
