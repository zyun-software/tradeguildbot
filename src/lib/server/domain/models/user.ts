import { Entity, RepositoryId, type RepositorySave } from '$lib/server/core';

export abstract class UserRepository
	extends RepositoryId<UserEntity>
	implements RepositorySave<UserEntity>
{
	public abstract updateRoute(entity: UserEntity): Promise<void>;
	public abstract updateData(entity: UserEntity): Promise<void>;

	public abstract save(entity: UserEntity): Promise<UserEntity>;
}

export class UserDefaultValue {
	public static route: string = 'home';
	public static data: any = {};
}

type UserDataType = {
	[k: string]: any;
	selectedGuildId?: number;
};

export type UserModel = {
	id: number;
	route: string;
	data: UserDataType;
};

export class UserEntity extends Entity<UserModel, UserRepository> {
	public get route(): string {
		return this.__model.route;
	}

	public async setRoute(value: string): Promise<UserEntity> {
		this.__model.route = value;
		if (this.__created) {
			await this.__repository.updateRoute(this);
		}

		return this;
	}

	public get data(): UserDataType {
		return this.__model.data;
	}

	public async setData(value: UserDataType): Promise<UserEntity> {
		this.__model.data = value;
		if (this.__created) {
			this.__repository.updateData(this);
		}

		return this;
	}
}
