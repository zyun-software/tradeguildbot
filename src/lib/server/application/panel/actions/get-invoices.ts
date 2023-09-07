import type { PaginationType } from '$lib/server/core';
import type { InvoiceEntity } from '$lib/server/domain';
import type { Invoice, Pagination } from '$lib/types';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetInvoicesAction extends ApiAction<
	{
		guild_id: number;
		id?: number;
		type?: 'seller_create' | 'payer_create' | 'seller_paid' | 'payer_paid';
		currency_id?: number;
		name?: string;
		page?: number;
	},
	Pagination<Invoice>
> {
	public async execute(): Promise<ApiActionExecuteType<Pagination<Invoice>>> {
		const result = getDefaultApiActionResult<Pagination<Invoice>>(
			'Недостатньо параметрів для пошуку '
		);

		const currencyRepository = DependencyInjection.CurrencyRepository;
		const currency = await currencyRepository.findById(this._data.currency_id ?? -1);

		if (!currency) {
			result.error = 'Валюту не знайдено';
			return result;
		}

		const invoiceRepository = DependencyInjection.InvoiceRepository;
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		const guildMember = await guildMemberRepository.getByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

		const createInvoiceObject = async (entity: InvoiceEntity): Promise<Invoice> => {
			const accountPayer = await entity.getPayerAccount();
			const guildMemberPayer = await accountPayer.getGuildMember();

			const accountSeller = await entity.getSellerAccount();
			const guildMemberSeller = await accountSeller.getGuildMember();

			if (![guildMemberSeller.id, guildMemberPayer.id].includes(guildMember.id)) {
				throw new Error();
			}

			return {
				id: entity.id,
				paid: entity.paid,
				amount: entity.amount,
				currency_id: currency.id,
				currency_code: currency.code,
				seller_name: guildMemberSeller.name,
				payer_name: guildMemberPayer.name,
				purpose: entity.purpose,
				can_pay: guildMemberPayer.id === guildMember.id && !entity.paid,
				can_cancel: guildMemberSeller.id === guildMember.id && !entity.paid
			};
		};

		if (typeof this._data.id === 'number') {
			let invoiceObj: Invoice | null = null;
			let find = false;
			const invoice = await invoiceRepository.findById(this._data.id);
			if (invoice) {
				try {
					invoiceObj = await createInvoiceObject(invoice);
					find = true;
				} catch {
					find = false;
				}
			}

			if (!invoiceObj) {
				result.error = 'Рахуноку за вказаним кодом не знайдено';
				return result;
			}

			result.success = true;
			result.response = {
				items: [invoiceObj],
				page: 1,
				next: false
			};

			return result;
		}

		if (
			typeof this._data.type === 'string' &&
			typeof this._data.currency_id === 'number' &&
			typeof this._data.name === 'string' &&
			typeof this._data.page === 'number'
		) {
			let pagination: PaginationType<InvoiceEntity> | null = null;

			if (['seller_create', 'payer_paid'].includes(this._data.type)) {
				pagination = await invoiceRepository.getListBySellerMemberIdAndCurrencyIdAndNamePart(
					guildMember.id,
					this._data.currency_id,
					this._data.type === 'payer_paid',
					this._data.name,
					this._data.page
				);
			}

			if (['payer_create', 'seller_paid'].includes(this._data.type)) {
				pagination = await invoiceRepository.getListByPayerMemberIdAndCurrencyIdAndNamePart(
					guildMember.id,
					this._data.currency_id,
					this._data.type === 'seller_paid',
					this._data.name,
					this._data.page
				);
			}

			if (pagination) {
				if (!pagination.items.length) {
					result.error = 'Нічого не знайдено';
					return result;
				}

				result.success = true;
				result.response = {
					items: (
						await Promise.all(
							pagination.items.map(async (item, index) => {
								const result = await createInvoiceObject(item);
								return { index, result };
							})
						)
					)
						.sort((a, b) => a.index - b.index)
						.map((item) => item.result),
					page: pagination.page,
					next: pagination.next
				};
			}
		}

		return result;
	}
}
