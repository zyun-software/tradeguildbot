import type { RepositorySave } from './repository';

export abstract class Entity<
	TModel extends { id: number },
	TRepository extends RepositorySave<Entity<any, any>>
> {
	protected __created: boolean;
	protected __repository: TRepository;
	protected __model: TModel;

	public get id(): number {
		return this.__model.id;
	}

	public constructor(options: { model: TModel; repository: TRepository }) {
		this.__model = options.model;
		this.__created = options.model.id !== -1;
		this.__repository = options.repository;
	}

	public create(): Promise<Entity<TModel, TRepository>> {
		const entity = this.__repository.save(this);
		this.__created = true;

		return entity;
	}
}
