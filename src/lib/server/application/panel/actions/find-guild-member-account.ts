import type { MoneyType } from '$lib/server/domain';
import type { AccountResponseType } from '$lib/types';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class FindGuildMemberAccountAction extends ApiAction<
	{
		guild_id: number;
		currency_id: number;
		nickname: string;
	},
	AccountResponseType
> {
	public async execute(): Promise<ApiActionExecuteType<AccountResponseType>> {
		const moneyService = DependencyInjection.MoneyService;
		const result = getDefaultApiActionResult<AccountResponseType>();

		let money: MoneyType;

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
