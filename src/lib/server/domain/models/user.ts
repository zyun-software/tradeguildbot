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
	apiToken?: {
		[token: string]: number;
	};
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

	public async setApiToken(token: string, guild_id: number): Promise<UserEntity> {
		if (!this.__model.data.apiToken) {
			this.__model.data.apiToken = {};
		}

		for (const existingToken in this.__model.data.apiToken) {
			if (this.__model.data.apiToken.hasOwnProperty(existingToken)) {
				if (this.__model.data.apiToken[existingToken] === guild_id) {
					delete this.__model.data.apiToken[existingToken];
				}
			}
		}

		this.__model.data.apiToken[token] = guild_id;

		return this.setData(this.__model.data);
	}

	public getApiGuildIdByToken(token: string): number | null {
		const apiToken = this.__model.data.apiToken;
		if (apiToken && apiToken[token]) {
			return apiToken[token];
		}

		return null;
	}

	public getApiTokenByGuildId(guild_id: number): string | null {
		const apiToken = this.__model.data.apiToken;

		for (const token in apiToken) {
			if (apiToken.hasOwnProperty(token)) {
				if (apiToken[token] === guild_id) {
					return token;
				}
			}
		}

		return null;
	}
}
