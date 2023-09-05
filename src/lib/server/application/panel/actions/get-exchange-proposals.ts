import type { PaginationType } from '$lib/server/core';
import type { ExchangeProposalEntity } from '$lib/server/domain';
import type { ExchangeOffer, Pagination } from '$lib/types';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetExchangeProposalsAction extends ApiAction<
	{
		guild_id: number;
		personal?: boolean;
		sell_currency_id?: number;
		buy_currency_id?: number;
		page: number;
	},
	Pagination<ExchangeOffer>
> {
	public async execute(): Promise<ApiActionExecuteType<Pagination<ExchangeOffer>>> {
		const result = getDefaultApiActionResult<Pagination<ExchangeOffer>>(
			'Не передані необхідні параметри'
		);

		const mapper = (entity: ExchangeProposalEntity): ExchangeOffer => {
			return {
				id: entity.id,
				sell_currency_id: entity.sell_currency_id,
				sell_amount: entity.sell_amount,
				buy_currency_id: entity.buy_currency_id,
				buy_amount: entity.buy_amount
			};
		};

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const guildMember = await guildMemberRepository.getByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

		const exchangeProposalRepository = DependencyInjection.ExchangeProposalRepository;

		let pagination: PaginationType<ExchangeProposalEntity>;

		const getPaginatedResult = (pagination: PaginationType<ExchangeProposalEntity>) => {
			result.success = true;

			result.response = {
				page: pagination.page,
				next: pagination.next,
				items: pagination.items.map(mapper)
			};

			return result;
		};

		if (this._data.personal) {
			pagination = await exchangeProposalRepository.getListByGuildMemberId(
				guildMember.id,
				this._data.page
			);

			return getPaginatedResult(pagination);
		}

		if (this._data.buy_currency_id && this._data.sell_currency_id) {
			if (this._data.buy_currency_id === this._data.sell_currency_id) {
				result.error = 'Валюти повинні бути різними';
				return result;
			}

			const pagination = await exchangeProposalRepository.getList(
				this._data.sell_currency_id,
				this._data.buy_currency_id,
				guildMember.id,
				this._data.page
			);

			return getPaginatedResult(pagination);
		}

		return result;
	}
}
