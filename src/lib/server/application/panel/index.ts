import type { UserEntity } from '$lib/server/domain';
import { Api } from '../api';
import {
	ChangeGuildMemberNicknameAction,
	ChangeSelectedGuildIdAction,
	FindNotApprovedGuildMembers,
	GetGuildMemberNicknamesAction,
	ProcessJoiningTheGuildAction,
	RegistrationInGuildAction
} from './actions';
import { GuildMasterGuard } from './guards';

export class Panel extends Api {
	public constructor(method: string, data: any, user: UserEntity) {
		super(method, data, user);

		const guard = {
			guildMaster: new GuildMasterGuard(user, data)
		};

		this._actions = {
			'change-guild-member-nickname': new ChangeGuildMemberNicknameAction(
				[guard.guildMaster],
				user,
				data
			),
			'change-selected-guild-id': new ChangeSelectedGuildIdAction([], user, data),
			'find-not-approved-guild-members': new FindNotApprovedGuildMembers(
				[guard.guildMaster],
				user,
				data
			),
			'get-guild-member-nicknames': new GetGuildMemberNicknamesAction([], user, data),
			'process-joining-the-guild': new ProcessJoiningTheGuildAction(
				[guard.guildMaster],
				user,
				data
			),
			'registration-in-guild': new RegistrationInGuildAction([], user, data)
		};
	}
}
