import { ApiAction, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetGuildCurrenciesAction extends ApiAction<{
	guild_id: number;
}> {
	public async execute(): Promise<ApiActionExecuteType> {
		const currencyRepository = DependencyInjection.CurrencyRepository;
		const result: {
			success: boolean;
			error: string;
			response:
				| null
				| {
						id: number;
						code: string;
						name: string;
						capital: number;
				  }[];
		} = {
			success: false,
			error: '',
			response: null
		};

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
