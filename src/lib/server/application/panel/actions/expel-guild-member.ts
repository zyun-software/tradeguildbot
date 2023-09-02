import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class ExpelGuildMemberAction extends ApiAction<
	{
		guild_id: number;
		name: string;
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const telegram = DependencyInjection.RequestRepository.telegram;
		const currencyRepository = DependencyInjection.CurrencyRepository;
		const guildRepository = DependencyInjection.GuildRepository;
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const moneyService = DependencyInjection.MoneyService;
		const result = getDefaultApiActionResult<string>();

		const guildMember = await guildMemberRepository.findByNameAndGuildId(
			this._data.name,
			this._data.guild_id
		);

		if (!guildMember) {
			result.error = 'Учасника гільдії не знайдено';
			return result;
		}

		const guild = await guildRepository.getById(this._data.guild_id);

		if (guild.owner_id === guildMember.user_id) {
			result.error = 'Не можна вигнати гільдмайстра';
			return result;
		}

		const guildMaster = await guildMemberRepository.findByUserIdAndGuildId(
			guild.owner_id,
			guild.id
		);

		if (!guildMaster) {
			result.error = 'Схоже гільдмайстер пропав';
			return result;
		}

		const currencies = await currencyRepository.getListByGuildId(guild.id);
		for (const currency of currencies) {
			const k = await moneyService.getByNameAndCurrencyIdAndGuildId(
				guildMember.name,
				currency.id,
				guild.id
			);

			const m = await moneyService.getByNameAndCurrencyIdAndGuildId(
				guildMaster.name,
				currency.id,
				guild.id
			);

			const kAmount = k.account.balance + k.account.reserve;
			await k.account.setBalance(0);

			const mBalance = kAmount + m.account.balance;
			await m.account.setBalance(mBalance);
		}

		await guildMemberRepository.delete(guildMember);

		await telegram('sendMessage', {
			chat_id: guildMember.user_id,
			text: '⛔ Вас було вигнано з гільдії'
		});

		result.success = true;
		result.response = '✅ Члена гільдії було вигнано';

		return result;
	}
}
