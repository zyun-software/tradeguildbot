import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class BillAction extends ApiAction<
	{
		guild_id: number;
		name: string;
		amount: number;
		purpose: string;
		currency_id: number;
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const result = getDefaultApiActionResult<string>();

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		const guildMemberSeller = await guildMemberRepository.findByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

		if (!guildMemberSeller || !guildMemberSeller.approved) {
			result.error = 'Продавця не знайдено';
			return result;
		}

		const moneyService = DependencyInjection.MoneyService;

		const createInvoice = await moneyService.createInvoice(
			this._data.guild_id,
			this._data.currency_id,
			guildMemberSeller.name,
			this._data.name,
			this._data.amount,
			this._data.purpose
		);

		result.success = createInvoice.success;
		if (result.success) {
			result.response = `✅ ${createInvoice.message}`;
		} else {
			result.error = createInvoice.message;
		}

		return result;
	}
}
