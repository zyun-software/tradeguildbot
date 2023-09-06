import type { ApiInvoice } from '$lib/types';
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
	ApiInvoice
> {
	public async execute(): Promise<ApiActionExecuteType<ApiInvoice>> {
		const result = getDefaultApiActionResult<ApiInvoice>();

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

		const invoiceRequest = await moneyService.createInvoice(
			this._guild.id,
			this._data.currency_id,
			guildMember.name,
			this._data.payer,
			this._data.amount,
			this._data.purpose
		);

		if (!invoiceRequest.success || !invoiceRequest.id) {
			result.error = invoiceRequest.message;
			return result;
		}

		const invoiceRepository = DependencyInjection.InvoiceRepository;
		const invoice = await invoiceRepository.getById(invoiceRequest.id);

		const accountPayer = await invoice.getPayerAccount();
		const guildMemberPayer = await accountPayer.getGuildMember();

		const accountSeller = await invoice.getSellerAccount();
		const guildMemberSeller = await accountSeller.getGuildMember();

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
