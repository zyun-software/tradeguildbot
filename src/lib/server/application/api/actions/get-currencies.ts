import type { CurrencyType } from '$lib/types';
import { getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';
import { ApiJsonAction } from '../interfaces';

export class GetCurrenciesAction extends ApiJsonAction<{}, CurrencyType[]> {
	public async execute(): Promise<ApiActionExecuteType<CurrencyType[]>> {
		const result = getDefaultApiActionResult<CurrencyType[]>();

		const currencyRepository = DependencyInjection.CurrencyRepository;
		const currencies = await currencyRepository.getListByGuildId(this._guild.id);

		result.success = true;
		result.response = currencies.map((entity) => {
			return {
				id: entity.id,
				code: entity.code,
				name: entity.name,
				capital: entity.capital
			};
		});

		return result;
	}
}
