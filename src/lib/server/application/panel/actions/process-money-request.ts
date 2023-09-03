import type { MoneyType } from '$lib/server/domain';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class ProcessMoneyRequestAction extends ApiAction<
	{
		guild_id: number;
		currency_id: number;
		nickname: string;
		action: 'approve' | 'reject';
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const guildRepository = DependencyInjection.GuildRepository;
		const telegram = DependencyInjection.RequestRepository.telegram;
		const moneyService = DependencyInjection.MoneyService;
		const result = getDefaultApiActionResult<string>();

		let money: MoneyType;

		const guild = await guildRepository.getById(this._data.guild_id);

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

		if (!money.account.money_request) {
			result.error = 'Цей запит на обробку коштів не мое бути оброблений';
			return result;
		}

		switch (this._data.action) {
			case 'approve':
			case 'reject':
				await money.account.setMoneyRequest(false);

				let message: string;
				result.success = true;
				if (this._data.action === 'approve') {
					if (money.account.money_request_type === 'introduction') {
						const balance = money.account.balance + money.account.money_request_amount;
						await money.account.setBalance(balance);
					} else {
						const reserve = money.account.reserve - money.account.money_request_amount;
						await money.account.setReserve(reserve);
					}

					message = '✅ Запит на отримання коштів схвалено';
					result.response = '✅ Запит схвалено';
				} else {
					if (money.account.money_request_type === 'receiving') {
						const reserve = money.account.reserve - money.account.money_request_amount;
						await money.account.setReserve(reserve);
						const balance = money.account.balance + money.account.money_request_amount;
						await money.account.setBalance(balance);
					}

					message = '🚫 Запит на отримання коштів відхилено';
					result.response = '🚫 Запит відхилено';
				}

				await telegram('sendMessage', {
					chat_id: money.guild_member.user_id,
					text:
						`${message}\n\n` +
						`🏛️ Гільдія: *${guild.name}*\n` +
						`💰 Сума: *${money.account.money_request_amount} ${money.currency.code}*`
				});

				await money.account.setMoneyRequestAmount(0);

				break;
		}

		return result;
	}
}
