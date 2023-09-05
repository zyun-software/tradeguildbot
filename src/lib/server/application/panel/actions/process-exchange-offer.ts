import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class ProcessExchangeOfferAction extends ApiAction<
	{
		guild_id: number;
		id: number;
		action: 'cancel' | 'buy';
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const result = getDefaultApiActionResult<string>('Дію для пропозиції не передано');

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const guildMember = await guildMemberRepository.getByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

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
					result.error = 'Пропозицію для скасування не знайдено';
					return result;
				}

				await exchangeProposalRepository.delete(exchangeProposal);

				const money = await moneyService.getByNameAndCurrencyIdAndGuildId(
					guildMember.name,
					exchangeProposal.sell_currency_id,
					this._data.guild_id
				);

				await money.account.addToBalance(exchangeProposal.sell_amount);
				await money.account.removeFromReserve(exchangeProposal.sell_amount);

				result.success = true;
				result.response = '✅ Пропозицію обміну скасовано';

				break;

			case 'buy':
				if (exchangeProposal.guild_member_id === guildMember.id) {
					result.error = 'Не можна придбати свою пропозицію обміну';
					return result;
				}

				try {
					const payerBuy = await moneyService.getByNameAndCurrencyIdAndGuildId(
						guildMember.name,
						exchangeProposal.buy_currency_id,
						this._data.guild_id
					);

					if (payerBuy.account.balance < exchangeProposal.buy_amount) {
						result.error = 'У вас недостатньо коштів на балансі';
						return result;
					}

					await payerBuy.account.removeFromBalance(exchangeProposal.buy_amount);

					const payerSell = await moneyService.getByNameAndCurrencyIdAndGuildId(
						guildMember.name,
						exchangeProposal.sell_currency_id,
						this._data.guild_id
					);

					await payerSell.account.addToBalance(exchangeProposal.sell_amount);

					const sellerGuildMember = await guildMemberRepository.getById(
						exchangeProposal.guild_member_id
					);

					const sellerBuy = await moneyService.getByNameAndCurrencyIdAndGuildId(
						sellerGuildMember.name,
						exchangeProposal.buy_currency_id,
						this._data.guild_id
					);

					await sellerBuy.account.addToBalance(exchangeProposal.buy_amount);

					const sellerSell = await moneyService.getByNameAndCurrencyIdAndGuildId(
						sellerGuildMember.name,
						exchangeProposal.sell_currency_id,
						this._data.guild_id
					);

					await sellerSell.account.removeFromReserve(exchangeProposal.sell_amount);

					await exchangeProposalRepository.delete(exchangeProposal);

					const guildRepository = DependencyInjection.GuildRepository;
					const guild = await guildRepository.getById(this._data.guild_id);

					const telegram = DependencyInjection.RequestRepository.telegram;

					await telegram('sendMessage', {
						chat_id: sellerGuildMember.user_id,
						text:
							'💱 Відбувся обмін \n\n' +
							`🏛️ Гільдія: ${guild.name}\n` +
							`🛒 Продано: ${exchangeProposal.sell_amount} ${sellerSell.currency.code}\n` +
							`🛍️ Куплено: ${exchangeProposal.buy_amount} ${sellerBuy.currency.code} \n\n` +
							`#обмін`
					});

					result.success = true;
					result.response = '✅ Придбано';
				} catch (error: any) {
					result.error = error.message;
					return result;
				}

				break;
		}

		return result;
	}
}
