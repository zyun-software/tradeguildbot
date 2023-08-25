import { ActionInterace } from '$lib/server/core';
import type { UserEntity } from '$lib/server/domain';
import { findUserByTokenUtility } from './utilities';

export type ApiActionExecuteType = { success: boolean; error: string; response: any };

export abstract class ApiAction extends ActionInterace {
	public abstract execute(user: UserEntity, data: any): Promise<ApiActionExecuteType>;
}

export abstract class Api {
	public constructor(
		private _method: string,
		private _data: any,
		private _user: UserEntity,
		private _actions: { [method: string]: ApiAction }
	) {}

	public async getResponse(): Promise<null | ApiActionExecuteType> {
		if (this._method in this._actions) {
			const action = this._actions[this._method];
			const haveAccess = await action.auditAccess();
			if (haveAccess) {
				const result = await action.execute(this._user, this._data);
				return result;
			}

			return {
				success: false,
				error: 'У вас відсутній дозвіл на виконання цієї дії',
				response: null
			};
		}

		return null;
	}
}

export async function executeApi(
	token: string,
	createApi: (user: UserEntity) => Api
): Promise<{
	unauthorized: boolean;
	success: boolean;
	error: string;
	response: any;
}> {
	const result = {
		unauthorized: false,
		success: false,
		error: 'Дію для виконання не знайдено',
		response: null
	};

	const user = await findUserByTokenUtility(token, 'panel');

	if (!user) {
		result.unauthorized = true;
		result.error = 'Потрібно авторизуватися';
		return result;
	}

	try {
		const api = createApi(user);
		const apiResult = await api.getResponse();
		if (apiResult) {
			return {
				...apiResult,
				unauthorized: false
			};
		}
	} catch {
		result.error = 'Виникла внутрішня помилка сервера';
	}

	return result;
}
