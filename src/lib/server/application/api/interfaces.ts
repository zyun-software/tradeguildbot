import type { GuardsType } from '$lib/server/core';
import type { GuildEntity, UserEntity } from '$lib/server/domain';
import { ApiAction } from '../api';

export abstract class ApiJsonAction<TData, TResponse> extends ApiAction<TData, TResponse> {
	public constructor(
		guards: GuardsType,
		data: TData,
		user: UserEntity,
		protected _guild: GuildEntity
	) {
		super(guards, user, data);
	}
}
