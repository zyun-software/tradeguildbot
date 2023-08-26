import type { UserEntity } from '../domain';

export abstract class GuardInterface<TData> {
	public constructor(protected _user: UserEntity, protected _data: TData) {}

	public abstract audit(): Promise<boolean>;
}
