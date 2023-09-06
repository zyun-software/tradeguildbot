import type { ApiInvoice } from '$lib/types';
import { getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';
import { ApiJsonAction } from '../interfaces';

export class GetInvoiceAction extends ApiJsonAction<{ id: number }, ApiInvoice> {
	public async execute(): Promise<ApiActionExecuteType<ApiInvoice>> {
		const result = getDefaultApiActionResult<ApiInvoice>();

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const guildMember = await guildMemberRepository.getByUserIdAndGuildId(
			this._user.id,
			this._guild.id
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

		const currencyRepository = DependencyInjection.CurrencyRepository;
		const currency = await currencyRepository.getById(accountPayer.currency_id);

		result.success = true;
		result.response = {
			id: invoice.id,
			paid: invoice.paid,
			amount: invoice.amount,
			currency_id: currency.id,
			currency_code: currency.code,
			seller_name: guildMemberSeller.name,
			payer_name: guildMemberPayer.name,
			purpose: invoice.purpose
		};

		return result;
	}
}
