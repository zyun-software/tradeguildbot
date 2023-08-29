import type { AccountEntity, CurrencyEntity, GuildMemberEntity } from '$lib/server/domain';
import { ApiAction, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class CreateMoneyRequestAction extends ApiAction<{
	guild_id: number;
	name: string;
	currency_id: number;
	amount: number;
	type: 'introduction' | 'receiving';
}> {
	public async execute(): Promise<ApiActionExecuteType> {
		const telegram = DependencyInjection.RequestRepository.telegram;
		const guildRepository = DependencyInjection.GuildRepository;
		const moneyService = DependencyInjection.MoneyService;
		const result: {
			success: boolean;
			error: string;
			response: null | string;
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
				this._data.name,
				this._data.currency_id,
				this._data.guild_id
			);
		} catch (error: any) {
			result.error = error.message;
			return result;
		}

		if (money.guild_member.user_id !== this._user.id) {
			result.error = 'Ви не можете створити запит коштів для іншої людини';
			return result;
		}

		if (money.account.money_request) {
			result.error = 'Потрібно дочекатися виконання попереднього запиту отримання коштів';
			return result;
		}

		if (!['introduction', 'receiving'].includes(this._data.type)) {
			result.error = 'Невідомий тип запиту отримування коштів';
			return result;
		}

		if (typeof this._data.amount !== 'number') {
			result.error = 'Суму потрібно передавати числом';
			return result;
		}

		if (this._data.amount < 1) {
			result.error = 'Сума повинна бути більше нуля';
			return result;
		}

		if (this._data.type === 'receiving') {
			if (money.account.balance < this._data.amount) {
				result.error = 'У вас недостатньо коштів на рахунку для створення цього запиту';
				return result;
			}

			const balance = money.account.balance - this._data.amount;
			await money.account.setBalance(balance);

			const reserve = money.account.reserve + this._data.amount;
			await money.account.setReserve(reserve);
		}

		await money.account.setMoneyRequest(true);
		await money.account.setMoneyRequestType(this._data.type);
		await money.account.setMoneyRequestAmount(this._data.amount);

		const guild = await guildRepository.getById(money.guild_member.guild_id);

		await telegram('sendMessage', {
			chat_id: guild.owner_id,
			text:
				'🤲 Отримано запит коштів\n\n' +
				`🏛️ Гільдія: *${guild.name}*\n` +
				`🏷️ Отримувач: \`${money.guild_member.name}\`\n` +
				`💰 Сума: *${this._data.amount} ${money.currency.code}*`
		});

		result.success = true;
		result.response = '✅ Запит отримання коштів створено';

		return result;
	}
}