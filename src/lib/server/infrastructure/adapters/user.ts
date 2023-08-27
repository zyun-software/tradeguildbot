import { UserEntity, UserRepository, type UserModel } from '$lib/server/domain';
import { sql } from '../api';

const table = 'users';

export class UserAdapter extends UserRepository {
	public async updateRoute(entity: UserEntity): Promise<void> {
		const { id, route } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET route = ${route}
			WHERE id = ${id}
		`;
	}

	public async updateData(entity: UserEntity): Promise<void> {
		let { id, data } = entity;

		await sql`
			UPDATE ${sql(table)}
			SET data = ${data}
			WHERE id = ${id}
		`;
	}

	public async findById(id: number): Promise<UserEntity | null> {
		const models = await sql<UserModel[]>`
			SELECT *
			FROM ${sql(table)}
			WHERE id = ${id}
		`;

		const result = this._find(models);

		return result;
	}

	public async save(entity: UserEntity): Promise<UserEntity> {
		const { id, route, data } = entity;

		const models = await sql<UserModel[]>`
			INSERT INTO ${sql(table)}
				(id, route, data)
			VALUES
				(${id}, ${route}, ${data})
			ON CONFLICT (id) DO UPDATE
				SET route = EXCLUDED.route,
						data = EXCLUDED.data
			RETURNING *
		`;

		const result = this._find(models);

		if (!result) {
			throw new Error('Помилка збереження користувача');
		}

		return result;
	}

	private _mapper(row: UserModel): UserModel {
		return {
			...row,
			id: parseInt(row.id.toString())
		};
	}

	private _find(models: UserModel[]): UserEntity | null {
		if (!models.length) {
			return null;
		}

		const entity = new UserEntity({ model: this._mapper(models[0]), repository: this });

		return entity;
	}
}
