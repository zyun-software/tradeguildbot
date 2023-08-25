import type { UserEntity } from '$lib/server/domain';
import { Api } from '../api';
import { RegistrationInGuildAction } from './registration-in-guild';

export class Panel extends Api {
	public constructor(method: string, data: any, user: UserEntity) {
		super(method, data, user, {
			'registration-in-guild': new RegistrationInGuildAction()
		});
	}
}
