import type { UserEntity } from '$lib/server/domain';
import { ApiAction, type ApiActionExecuteType } from '../api';

export class ChangeSelectedGuildIdAction extends ApiAction {
	public async execute(
		user: UserEntity,
		data: {
			guild_id: number;
		}
	): Promise<ApiActionExecuteType> {
		const result: {
			success: boolean;
			error: string;
			response: null | { message: string };
		} = {
			success: false,
			error: '',
			response: null
		};

		if (typeof data.guild_id !== 'number') {
			result.error =
				'Необхідно передати ідентифікатор гільдію, меню якої буде автоматично відкриватися';
			return result;
		}

		await user.setData({
			...user.data,
			selectedGuildId: data.guild_id
		});

		result.success = true;
		result.response = {
			message: '✅ Автоматичне відкриття меню гільдії налаштовано'
		};

		return result;
	}
}
