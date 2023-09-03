import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class ProcessExchangeOfferAction extends ApiAction<
	{
		guild_id: number;
		id: number;
		action: 'cancel';
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const result = getDefaultApiActionResult<string>('Дію для пропозиції не передано');

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const guildMember = await guildMemberRepository.findByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

		if (!guildMember) {
			result.error = 'Учасника гільдії не знайдено';
			return result;
		}

		const exchangeProposalRepository = DependencyInjection.ExchangeProposalRepository;
		const exchangeProposal = await exchangeProposalRepository.findById(this._data.id);

		if (!exchangeProposal) {
			result.error = 'Пропозиція обміну більше не існує';
			return result;
		}

		const moneyService = DependencyInjection.MoneyService;

		switch (this._data.action) {
			case 'cancel':
				if (exchangeProposal.guild_member_id !== guildMember.id) {
					result.error = 'Скасовувати можна тільки свої пропозиції обміну';
					return result;
				}

				await exchangeProposalRepository.delete(exchangeProposal);

				let money = await moneyService.getByNameAndCurrencyIdAndGuildId(
					guildMember.name,
					exchangeProposal.sell_currency_id,
					this._data.guild_id
				);

				let balance = money.account.balance + exchangeProposal.sell_amount;
				await money.account.setBalance(balance);

				let reserve = money.account.reserve - exchangeProposal.sell_amount;
				await money.account.setReserve(reserve);

				result.success = true;
				result.response = '✅ Пропозицію обміну скасовано';

				break;
		}

		return result;
	}
}
