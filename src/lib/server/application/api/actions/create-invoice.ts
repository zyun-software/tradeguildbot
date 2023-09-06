import { getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';
import { ApiJsonAction } from '../interfaces';

export class CreateInvoiceAction extends ApiJsonAction<
	{
		currency_id: number;
		payer: string;
		amount: number;
		purpose: string;
	},
	number
> {
	public async execute(): Promise<ApiActionExecuteType<number>> {
		const result = getDefaultApiActionResult<number>();

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

		const invoice = await moneyService.createInvoice(
			this._guild.id,
			this._data.currency_id,
			guildMember.name,
			this._data.payer,
			this._data.amount,
			this._data.purpose
		);

		if (!invoice.success || !invoice.id) {
			result.error = invoice.message;
			return result;
		}

		result.success = true;
		result.response = invoice.id;

		return result;
	}
}
