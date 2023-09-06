import { PANEL_URL } from '$env/static/private';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { createApiTokenUtility } from '../../utilities';

type TResponse = {
	token: string;
	url: string;
};

export class ApiSettingsAction extends ApiAction<
	{
		guild_id: number;
		action: 'get' | 'update';
	},
	TResponse
> {
	public async execute(): Promise<ApiActionExecuteType<TResponse>> {
		const result = getDefaultApiActionResult<TResponse>('Невідома дія');

		const userToken = this._user.getApiTokenByGuildId(this._data.guild_id);

		let token = userToken
			? `${this._user.id}:${userToken}`
			: await createApiTokenUtility(this._user, this._data.guild_id);

		if (this._data.action === 'update' && userToken) {
			token = await createApiTokenUtility(this._user, this._data.guild_id);
		}

		if (['get', 'update'].includes(this._data.action)) {
			result.success = true;
			result.response = {
				token,
				url: `${PANEL_URL}/api`
			};
		}

		return result;
	}
}
