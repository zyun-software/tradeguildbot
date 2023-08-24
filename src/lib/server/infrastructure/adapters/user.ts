import { UserEntity, UserRepository, type UserModel } from '$lib/server/domain';
import { sql } from '../api';

const columns = ['id', 'route', 'data'];
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
			SELECT ${sql(columns)}
			FROM ${sql(table)}
			WHERE id = ${id}
		`;

		if (!models.length) {
			return null;
		}

		const entity = new UserEntity({
			model: models[0],
			repository: this
		});

		return entity;
	}

	public async save(entity: UserEntity): Promise<UserEntity> {
		const { id, route, data } = entity;

		const models = await sql<UserModel[]>`
			INSERT INTO ${sql(table)}
				(${sql(columns)})
			VALUES
				(${id}, ${route}, ${data})
			RETURNING *
		`;

		if (!models.length) {
			throw new Error('Помилка збереження користувача');
		}

		const result = new UserEntity({ model: models[0], repository: this });

		return result;
	}
}
