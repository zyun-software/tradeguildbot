import type { AccountEntity, CurrencyEntity, GuildMemberEntity } from '$lib/server/domain';
import { ApiAction, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class FindGuildMemberAccountAction extends ApiAction<{
	guild_id: number;
	currency_id: number;
	nickname: string;
}> {
	public async execute(): Promise<ApiActionExecuteType> {
		const moneyService = DependencyInjection.MoneyService;
		const result: {
			success: boolean;
			error: string;
			response: null | {
				name: string;
				currency: {
					name: string;
					code: string;
				};
				balance: number;
				reserve: number;
				moneyRequest?: {
					type: 'introduction' | 'receiving';
					amount: number;
				};
			};
		} = {
			success: false,
			error: '',
			response: null
		};

		let money: {
			guild_member: GuildMemberEntity;
			account: AccountEntity;
			currency: CurrencyEntity;
		};

		try {
			money = await moneyService.getByNameAndCurrencyIdAndGuildId(
				this._data.nickname,
				this._data.currency_id,
				this._data.guild_id
			);
		} catch (error: any) {
			result.error = error.message;
			return result;
		}

		result.success = true;
		result.response = {
			name: money.guild_member.name,
			currency: {
				name: money.currency.name,
				code: money.currency.code
			},
			balance: money.account.balance,
			reserve: money.account.reserve
		};

		if (money.account.money_request) {
			result.response.moneyRequest = {
				type: money.account.money_request_type,
				amount: money.account.money_request_amount
			};
		}

		return result;
	}
}
