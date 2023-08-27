import { ActionInterace } from '$lib/server/core';
import type { UserEntity } from '$lib/server/domain';

type HandleType = Promise<void | string>;

export abstract class TelegramBotAction<TResponse> extends ActionInterace<TResponse> {
	public abstract handleExecute(user: UserEntity): HandleType;

	public async handleAccessDenied(user: UserEntity): HandleType {}
}
