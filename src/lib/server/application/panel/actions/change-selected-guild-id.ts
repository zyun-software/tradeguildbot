import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';

export class ChangeSelectedGuildIdAction extends ApiAction<
	{
		guild_id: number;
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const result = getDefaultApiActionResult<string>();

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
		result.response = '✅ Автоматичне відкриття меню гільдії налаштовано';

		return result;
	}
}
