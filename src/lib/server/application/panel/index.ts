import type { UserEntity } from '$lib/server/domain';
import { Api } from '../api';
import {
	ChangeGuildMemberNicknameAction,
	ChangeSelectedGuildIdAction,
	CreateAnExchangeOfferAction,
	CreateMoneyRequestAction,
	FindGuildMemberAccountAction,
	FindNotApprovedGuildMembers,
	GetExchangeProposalsAction,
	GetGuildCurrenciesAction,
	GetGuildMemberNicknamesAction,
	ProcessExchangeOfferAction,
	ProcessGuildCurrencyAction,
	ProcessJoiningTheGuildAction,
	ProcessMoneyRequestAction,
	RegistrationInGuildAction,
	TransferFundsAction,
	WipeAction
} from './actions';
import { ExpelGuildMemberAction } from './actions/expel-guild-member';
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
			'create-an-exchange-offer': new CreateAnExchangeOfferAction([guard.guildMember], user, data),
			'expel-guild-member': new ExpelGuildMemberAction([guard.guildMaster], user, data),
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
			'get-exchange-proposals': new GetExchangeProposalsAction([guard.guildMember], user, data),
			'get-guild-currencies': new GetGuildCurrenciesAction([guard.guildMember], user, data),
			'get-guild-member-nicknames': new GetGuildMemberNicknamesAction(
				[guard.guildMember],
				user,
				data
			),
			'process-exchange-offer': new ProcessExchangeOfferAction([guard.guildMember], user, data),
			'process-guild-currency': new ProcessGuildCurrencyAction([guard.guildMaster], user, data),
			'process-joining-the-guild': new ProcessJoiningTheGuildAction(
				[guard.guildMaster],
				user,
				data
			),
			'process-money-request': new ProcessMoneyRequestAction([guard.guildMaster], user, data),
			'registration-in-guild': new RegistrationInGuildAction([], user, data),
			'transfer-funds': new TransferFundsAction([guard.guildMember], user, data),
			wipe: new WipeAction([guard.guildMaster], user, data)
		};
	}
}
