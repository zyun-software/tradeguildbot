import { ActionInterace } from '$lib/server/core';
import type { UserEntity } from '$lib/server/domain';
import { findUserByTokenUtility } from './utilities';

export type ApiActionExecuteType<TResponse> = {
	success: boolean;
	error: string;
	response: null | TResponse;
};

export abstract class ApiAction<TData, TResponse> extends ActionInterace<TData> {
	public abstract execute(): Promise<ApiActionExecuteType<TResponse>>;
}

export function getDefaultApiActionResult<TResponse>(
	error: string = ''
): ApiActionExecuteType<TResponse> {
	return {
		success: false,
		error,
		response: null
	};
}

export abstract class Api {
	public constructor(
		private _method: string,
		private _data: any,
		private _user: UserEntity,
		protected _actions: { [method: string]: ApiAction<any, any> } = {}
	) {
		if (typeof this._data !== 'object') {
			this._data = {};
		}
	}

	public async getResponse(): Promise<null | ApiActionExecuteType<any>> {
		if (this._method in this._actions) {
			const action = this._actions[this._method];
			const haveAccess = await action.auditAccess();
			if (haveAccess) {
				const result = await action.execute();
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
	} catch (error) {
		console.log('ApiError', error);

		result.error = 'Виникла внутрішня помилка сервера';
	}

	return result;
}
