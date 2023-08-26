import type { UserEntity } from '$lib/server/domain';
import { Api } from '../api';
import {
	ChangeSelectedGuildIdAction,
	FindNotApprovedGuildMembers,
	RegistrationInGuildAction,ProcessJoiningTheGuildAction
} from './actions';
import { GuildMasterGuard } from './guards';

export class Panel extends Api {
	public constructor(method: string, data: any, user: UserEntity) {
		super(method, data, user);

		const guard = {
			guildMaster: new GuildMasterGuard(user, data)
		};

		this._actions = {
			'change-selected-guild-id': new ChangeSelectedGuildIdAction([], user, data),
			'find-not-approved-guild-members': new FindNotApprovedGuildMembers(
				[guard.guildMaster],
				user,
				data
			),
			'process-joining-the-guild': new ProcessJoiningTheGuildAction(
				[guard.guildMaster],
				user,
				data
			),
			'registration-in-guild': new RegistrationInGuildAction([], user, data)
		};
	}
}
