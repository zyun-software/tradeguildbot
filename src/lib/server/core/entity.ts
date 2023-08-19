export abstract class Entity<TRepository> {
	protected __created: boolean;
	protected __repository: TRepository;

	protected _id: number = -1;

	public get id(): number {
		return this._id;
	}

	public constructor(options: { created: boolean; repository: TRepository }) {
		this.__created = options.created;
		this.__repository = options.repository;
	}

	public abstract create(): Promise<Entity<TRepository>>;
}
