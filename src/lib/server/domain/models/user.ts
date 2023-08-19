import { Entity } from '$lib/server/core';

export interface UserRepository {
	updateRoute(entity: UserEntity): Promise<void>;
	updateData(entity: UserEntity): Promise<void>;

	findById(id: number): Promise<UserEntity | null>;
	save(entity: UserEntity): Promise<UserEntity>;
}

export class UserDefaultValue {
	public static route: string = 'home';
	public static data: any = {};
}

export class UserEntity extends Entity<UserRepository> {
	public set id(value: number) {
		if (!this.__created) {
			this._id = value;
		}
	}

	private _route: string = UserDefaultValue.route;

	public get route(): string {
		return this._route;
	}

	public set route(value: string) {
		this._route = value;
		if (this.__created) {
			this.__repository.updateRoute(this);
		}
	}

	private _data: any = UserDefaultValue.data;

	public get data(): any {
		return this._data;
	}

	public set data(value: any) {
		this._data = value;
		if (this.__created) {
			this.__repository.updateData(this);
		}
	}

	public constructor(created: boolean, repository: UserRepository) {
		super({ created, repository });
	}

	public create(): Promise<UserEntity> {
		const entity = this.__repository.save(this);
		this.__created = true;

		return entity;
	}
}
