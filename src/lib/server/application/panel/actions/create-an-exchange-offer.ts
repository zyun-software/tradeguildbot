import { ExchangeProposalEntity } from '$lib/server/domain';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class CreateAnExchangeOfferAction extends ApiAction<
	{
		guild_id: number;
		sell_currency_id: number;
		sell_amount: number;
		buy_currency_id: number;
		buy_amount: number;
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const result = getDefaultApiActionResult<string>();

		if (this._data.sell_amount < 1) {
			result.error = 'Сума продажу повинна бути більше нуля';
			return result;
		}

		if (this._data.buy_amount < 1) {
			result.error = 'Сума купівлі повинна бути більше нуля';
			return result;
		}

		if (this._data.sell_currency_id === this._data.buy_currency_id) {
			result.error = 'Валюти обміну повинні бути різні';
			return result;
		}

		const currencyRepository = DependencyInjection.CurrencyRepository;

		const sellCurrency = await currencyRepository.findById(this._data.sell_currency_id);
		if (!sellCurrency || sellCurrency.guild_id !== this._data.guild_id) {
			result.error = 'Валюту продажу не знайдено';
			return result;
		}

		const buyCurrency = await currencyRepository.findById(this._data.buy_currency_id);
		if (!buyCurrency || buyCurrency.guild_id !== this._data.guild_id) {
			result.error = 'Валюту купівлі не знайдено';
			return result;
		}

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		const guildMember = await guildMemberRepository.getByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

		const moneyService = DependencyInjection.MoneyService;

		const money = await moneyService.getByNameAndCurrencyIdAndGuildId(
			guildMember.name,
			sellCurrency.id,
			this._data.guild_id
		);

		if (money.account.balance < this._data.sell_amount) {
			result.error = `У вас недостатньо коштів на рахунку для створення цієї пропозиції`;
			return result;
		}

		const exchangeProposalRepository = DependencyInjection.ExchangeProposalRepository;
		await exchangeProposalRepository.save(
			new ExchangeProposalEntity({
				model: {
					id: -1,
					guild_member_id: guildMember.id,
					sell_currency_id: sellCurrency.id,
					sell_amount: this._data.sell_amount,
					buy_currency_id: buyCurrency.id,
					buy_amount: this._data.buy_amount
				},
				repository: exchangeProposalRepository
			})
		);

		await money.account.removeFromBalance(this._data.sell_amount);
		await money.account.addToReserve(this._data.sell_amount);

		result.success = true;
		result.response = '✅ Пропозицію обміну створено';

		return result;
	}
}
