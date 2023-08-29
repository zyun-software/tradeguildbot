import {
	AccountEntity,
	CurrencyEntity,
	GuildMemberEntity,
	type AccountRepository,
	type CurrencyRepository,
	type GuildMemberRepository
} from '../models';

export class MoneyService {
	public constructor(
		private _accountRepository: AccountRepository,
		private _currencyRepository: CurrencyRepository,
		private _guildMemberRepository: GuildMemberRepository
	) {}

	public async getByNameAndCurrencyIdAndGuildId(
		name: string,
		currency_id: number,
		guild_id: number
	): Promise<{
		guild_member: GuildMemberEntity;
		currency: CurrencyEntity;
		account: AccountEntity;
	}> {
		const guild_member = await this._guildMemberRepository.findByNameAndGuildId(name, guild_id);
		if (!guild_member) {
			throw new Error('Власник цього рахунку не являється учасником гільдії');
		}

		const currency = await this._currencyRepository.findById(currency_id);
		if (!currency || currency.guild_id !== guild_id) {
			throw new Error('Валюту не знайдено');
		}

		let account = await this._accountRepository.findByGuildMemberIdAndCurrencyId(
			guild_member.id,
			currency.id
		);

		if (!account) {
			const entity = new AccountEntity({
				model: {
					id: -1,
					guild_member_id: guild_member.id,
					currency_id: currency.id,
					balance: 0,
					reserve: 0,
					money_request: false,
					money_request_type: 'introduction',
					money_request_amount: 0
				},
				repository: this._accountRepository
			});

			account = await this._accountRepository.save(entity);
		}

		return { account, guild_member, currency };
	}
}
