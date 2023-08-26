import { ApiAction, type ApiActionExecuteType } from '../../api';

export class ChangeSelectedGuildIdAction extends ApiAction<{
	guild_id: number;
}> {
	public async execute(): Promise<ApiActionExecuteType> {
		const result: {
			success: boolean;
			error: string;
			response: null | { message: string };
		} = {
			success: false,
			error: '',
			response: null
		};

		if (typeof this._data.guild_id !== 'number') {
			result.error =
				'Необхідно передати ідентифікатор гільдію, меню якої буде автоматично відкриватися';
			return result;
		}

		await this._user.setData({
			...this._user.data,
			selectedGuildId: this._data.guild_id
		});

		result.success = true;
		result.response = {
			message: '✅ Автоматичне відкриття меню гільдії налаштовано'
		};

		return result;
	}
}
