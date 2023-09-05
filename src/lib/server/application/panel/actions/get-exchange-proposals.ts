import type { ExchangeProposalEntity } from '$lib/server/domain';
import type { ExchangeOffer, Pagination } from '$lib/types';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetExchangeProposalsAction extends ApiAction<
	{
		guild_id: number;
		personal?: boolean;
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

		const exchangeProposalRepository = DependencyInjection.ExchangeProposalRepository;
		if (this._data.personal) {
			const guildMemberRepository = DependencyInjection.GuildMemberRepository;
			const guildMember = await guildMemberRepository.findByUserIdAndGuildId(
				this._user.id,
				this._data.guild_id
			);

			if (!guildMember) {
				result.error = 'Учасника гільдії не знайдено';
				return result;
			}

			const list = await exchangeProposalRepository.getListByGuildMemberId(guildMember.id);

			result.success = true;

			result.response = {
				page: 1,
				next: false,
				items: list.map(mapper)
			};

			return result;
		}

		return result;
	}
}
