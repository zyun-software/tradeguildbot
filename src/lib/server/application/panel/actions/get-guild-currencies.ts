import type { CurrencyType } from '$lib/types';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetGuildCurrenciesAction extends ApiAction<
	{
		guild_id: number;
	},
	CurrencyType[]
> {
	public async execute(): Promise<ApiActionExecuteType<CurrencyType[]>> {
		const currencyRepository = DependencyInjection.CurrencyRepository;
		const result = getDefaultApiActionResult<CurrencyType[]>();

		const list = await currencyRepository.getListByGuildId(this._data.guild_id);

		result.success = true;
		result.response = list.map((item) => {
			return {
				id: item.id,
				code: item.code,
				name: item.name,
				capital: item.capital
			};
		});

		return result;
	}
}
