import { ActionInterace } from '$lib/server/core';
import type { UserEntity } from '$lib/server/domain';

type HandleType = Promise<void | string>;

export abstract class TelegramBotAction extends ActionInterace {
	public abstract handleExecute(user: UserEntity, response: any): HandleType;

	public async handleAccessDenied(user: UserEntity, response: any): HandleType {}
}
