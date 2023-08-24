import type { Entity } from '$lib/server/core';

export interface RepositorySave<TEntity extends Entity<any, any>> {
	save(entity: TEntity): Promise<TEntity>;
}

export abstract class RepositoryId<TEntity extends Entity<any, any>> {
	public abstract findById(id: number): Promise<TEntity | null>;

	public async getById(id: number): Promise<TEntity> {
		const entity = await this.findById(id);
		if (!entity) {
			throw new Error('Сутність не знайдено');
		}

		return entity;
	}
}
