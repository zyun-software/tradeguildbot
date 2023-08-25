import type { UserEntity } from '$lib/server/domain';
import { ApiAction, type ApiActionExecuteType } from '../api';

export class RegistrationInGuildAction extends ApiAction {
	public async execute(user: UserEntity, data: any): Promise<ApiActionExecuteType> {
		console.log(user, data);
		
		return {
			success: false,
			error: 'Ти піська сосіська',
			response: null
		};
	}
}
