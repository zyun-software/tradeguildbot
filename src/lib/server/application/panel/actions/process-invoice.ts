import { DependencyInjection } from '../..';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';

export class ProcessInvoiceAction extends ApiAction<
	{
		guild_id: number;
		id: number;
		action: 'pay' | 'no_pay' | 'cancel';
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const result = getDefaultApiActionResult<string>('Невідома дія для равиставленого рахунку');

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		const guildMember = await guildMemberRepository.getByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

		const invoiceRepository = DependencyInjection.InvoiceRepository;
		const invoice = await invoiceRepository.findById(this._data.id);

		const notFound = 'Рахунок не знайдено';

		if (!invoice) {
			result.error = notFound;
			return result;
		}

		const accountPayer = await invoice.getPayerAccount();
		const guildMemberPayer = await accountPayer.getGuildMember();

		const accountSeller = await invoice.getSellerAccount();
		const guildMemberSeller = await accountSeller.getGuildMember();

		if (![guildMemberSeller.id, guildMemberPayer.id].includes(guildMember.id)) {
			result.error = notFound;
			return result;
		}

		const guildRepository = DependencyInjection.GuildMemberRepository;
		const guild = await guildRepository.getById(this._data.guild_id);

		const telegram = DependencyInjection.RequestRepository.telegram;

		if (this._data.action === 'cancel') {
			if (guildMemberSeller.id !== guildMember.id || invoice.paid) {
				result.error = 'Ви не можете скасувати цей рахунок';
				return result;
			}

			await invoiceRepository.delete(invoice);

			await telegram('sendMessage', {
				chat_id: guildMemberPayer.user_id,
				text:
					'🗑 Виставлений рахунок було скасовано\n\n' +
					`🏛️ Гільдія: *${guild.name}*\n` +
					`🎫 Код: *${invoice.id}*\n` +
					`🛒 Продавець: \`${guildMemberSeller.name}\``
			});

			result.success = true;
			result.response = '✅ Рахунок було скасовано';

			return result;
		}

		if (this._data.action === 'no_pay') {
			if (guildMemberPayer.id !== guildMember.id || invoice.paid) {
				result.error = 'Ви не можете відмовити у сплаті цього рахуноку';
				return result;
			}

			await invoiceRepository.delete(invoice);

			await telegram('sendMessage', {
				chat_id: guildMemberSeller.user_id,
				text:
					'🚫 У сплаті рахунку було відмовлено\n\n' +
					`🏛️ Гільдія: *${guild.name}*\n` +
					`🎫 Код: *${invoice.id}*\n` +
					`🛍️ Платник: \`${guildMemberPayer.name}\``
			});

			result.success = true;
			result.response = '✅ Ви успішно відмовили у сплаті цього рахунку';

			return result;
		}

		if (this._data.action === 'pay') {
			if (guildMemberPayer.id !== guildMember.id || invoice.paid) {
				result.error = 'Ви не можете сплатити цей рахунок';
				return result;
			}

			const moneyService = DependencyInjection.MoneyService;
			const transaction = await moneyService.transaction(
				accountPayer.currency_id,
				this._data.guild_id,
				guildMemberPayer.name,
				guildMemberSeller.name,
				invoice.amount,
				`Оплата рахунку #${invoice.id}`
			);

			if (!transaction.success) {
				result.error = transaction.message;
				return result;
			}

			await invoice.setPaid(true);

			result.success = true;
			result.response = '✅ Ви успішно сплатили цей рахунок';

			return result;
		}

		return result;
	}
}
