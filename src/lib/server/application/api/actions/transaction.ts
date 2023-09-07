import { getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';
import { ApiJsonAction } from '../interfaces';

export class TransactionAction extends ApiJsonAction<
	{
		currency_id: number;
		receiver: string;
		amount: number;
		comment: string;
	},
	boolean
> {
	public async execute(): Promise<ApiActionExecuteType<boolean>> {
		const result = getDefaultApiActionResult<boolean>();

		if (typeof this._data.amount !== 'number') {
			result.error = 'Сума повинна бути числом';
			return result;
		}

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const guildMember = await guildMemberRepository.getByUserIdAndGuildId(
			this._user.id,
			this._guild.id
		);

		const moneyService = DependencyInjection.MoneyService;
		const transaction = await moneyService.transaction(
			this._data.currency_id,
			this._guild.id,
			guildMember.name,
			this._data.receiver,
			this._data.amount,
			this._data.comment
		);

		if (!transaction.success) {
			result.error = transaction.message;
			return result;
		}

		result.success = true;
		result.response = true;

		return result;
	}
}
