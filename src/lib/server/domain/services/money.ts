import {
	AccountEntity,
	CurrencyEntity,
	GuildMemberEntity,
	GuildRepository,
	type AccountRepository,
	type CurrencyRepository,
	type GuildMemberRepository,
	type RequestRepository
} from '../models';

export type MoneyType = {
	guild_member: GuildMemberEntity;
	account: AccountEntity;
	currency: CurrencyEntity;
};

export class MoneyService {
	public constructor(
		private _accountRepository: AccountRepository,
		private _currencyRepository: CurrencyRepository,
		private _guildMemberRepository: GuildMemberRepository,
		private _requestRepository: RequestRepository,
		private _guildRepository: GuildRepository
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

	public async transaction(
		currency_id: number,
		guild_id: number,
		sender: string,
		receiver: string,
		amount: number,
		comment: string
	): Promise<{
		success: boolean;
		message: string;
	}> {
		const result = {
			success: false,
			message: ''
		};

		if (amount < 1) {
			result.message = 'Сума переказу повинна бути більше нуля';
			return result;
		}

		let me: MoneyType;

		try {
			me = await this.getByNameAndCurrencyIdAndGuildId(sender, currency_id, guild_id);
		} catch (error: any) {
			result.message = error.message;
			return result;
		}

		if (amount > me.account.balance) {
			result.message = 'У вас недостатньо коштів на балансі для здійснення переказу';
			return result;
		}

		let to: MoneyType;

		try {
			to = await this.getByNameAndCurrencyIdAndGuildId(receiver, currency_id, guild_id);
		} catch (error: any) {
			result.message = error.message;
			return result;
		}

		comment = comment.replace(/\s+/g, ' ').trim();
		comment = comment.length ? `\n💬 Коментар: ${comment}` : '';
		const maxLength = 200;
		comment = comment.length > maxLength ? comment.substring(0, maxLength) : comment;

		const meBalance = me.account.balance - amount;
		await me.account.setBalance(meBalance);

		const toBalance =
			me.guild_member.id === to.guild_member.id ? to.account.balance : to.account.balance + amount;
		await to.account.setBalance(toBalance);

		const guild = await this._guildRepository.getById(guild_id);

		await this._requestRepository.telegram('sendMessage', {
			chat_id: me.guild_member.user_id,
			text:
				'💸 Надіслано переказ коштів\n\n' +
				`🏛️ Гільдія: ${guild.name}\n` +
				`🏷️ Отримувач: ${to.guild_member.name}\n` +
				`💰 Сума: ${amount} ${me.currency.code}` +
				comment +
				`\n\n#надісланопереказ #${to.guild_member.name}`,
			parse_mode: undefined
		});

		await this._requestRepository.telegram('sendMessage', {
			chat_id: to.guild_member.user_id,
			text:
				'🤑 Отримано переказ коштів\n\n' +
				`🏛️ Гільдія: ${guild.name}\n` +
				`🏷️ Відправник: ${me.guild_member.name}\n` +
				`💰 Сума: ${amount} ${me.currency.code}` +
				comment +
				`\n\n#отриманопереказ #${me.guild_member.name}`,
			parse_mode: undefined
		});

		result.success = true;
		result.message = 'Переказ здійснено успішно';

		return result;
	}
}
