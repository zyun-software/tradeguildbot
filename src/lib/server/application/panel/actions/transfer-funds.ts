import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class TransferFundsAction extends ApiAction<
	{
		guild_id: number;
		currency_id: number;
		receiver: string;
		amount: number;
		comment: string;
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const moneyService = DependencyInjection.MoneyService;
		const result = getDefaultApiActionResult<string>();

		if (
			typeof this._data.currency_id !== 'number' ||
			typeof this._data.receiver !== 'string' ||
			typeof this._data.amount !== 'number' ||
			typeof this._data.comment !== 'string'
		) {
			result.error = 'Передані аргементи не вірні';
			return result;
		}

		const guildMember = await guildMemberRepository.findByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

		if (!guildMember) {
			result.error = 'Учасника гільдії не знайдено';
			return result;
		}

		const transaction = await moneyService.transaction(
			this._data.currency_id,
			this._data.guild_id,
			guildMember.name,
			this._data.receiver,
			this._data.amount,
			this._data.comment
		);

		result.success = transaction.success;
		if (result.success) {
			result.response = `✅ ${transaction.message}`;
		} else {
			result.error = transaction.message;
		}

		return result;
	}
}
