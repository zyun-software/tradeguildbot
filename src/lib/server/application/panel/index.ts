import type { UserEntity } from '$lib/server/domain';
import { Api } from '../api';
import {
	ChangeGuildMemberNicknameAction,
	ChangeSelectedGuildIdAction,
	CreateMoneyRequestAction,
	FindGuildMemberAccountAction,
	FindNotApprovedGuildMembers,
	GetGuildCurrenciesAction,
	GetGuildMemberNicknamesAction,
	ProcessGuildCurrencyAction,
	ProcessJoiningTheGuildAction,
	ProcessMoneyRequestAction,
	RegistrationInGuildAction,
	TransferFundsAction
} from './actions';
import { GuildMasterGuard, GuildMemberGuard } from './guards';

export class Panel extends Api {
	public constructor(method: string, data: any, user: UserEntity) {
		super(method, data, user);

		const guard = {
			guildMaster: new GuildMasterGuard(user, data),
			guildMember: new GuildMemberGuard(user, data)
		};

		this._actions = {
			'change-guild-member-nickname': new ChangeGuildMemberNicknameAction(
				[guard.guildMaster],
				user,
				data
			),
			'change-selected-guild-id': new ChangeSelectedGuildIdAction([], user, data),
			'create-money-request': new CreateMoneyRequestAction([guard.guildMember], user, data),
			'find-guild-member-account': new FindGuildMemberAccountAction(
				[guard.guildMaster, guard.guildMember],
				user,
				data
			),
			'find-not-approved-guild-members': new FindNotApprovedGuildMembers(
				[guard.guildMaster],
				user,
				data
			),
			'get-guild-currencies': new GetGuildCurrenciesAction([guard.guildMember], user, data),
			'get-guild-member-nicknames': new GetGuildMemberNicknamesAction(
				[guard.guildMember],
				user,
				data
			),
			'process-guild-currency': new ProcessGuildCurrencyAction([guard.guildMaster], user, data),
			'process-joining-the-guild': new ProcessJoiningTheGuildAction(
				[guard.guildMaster],
				user,
				data
			),
			'process-money-request': new ProcessMoneyRequestAction([guard.guildMaster], user, data),
			'registration-in-guild': new RegistrationInGuildAction([], user, data),
			'transfer-funds': new TransferFundsAction([guard.guildMember], user, data)
		};
	}
}
