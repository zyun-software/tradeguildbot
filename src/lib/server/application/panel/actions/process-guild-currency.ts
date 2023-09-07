import { CurrencyEntity } from '$lib/server/domain';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class ProcessGuildCurrencyAction extends ApiAction<
	{
		guild_id: number;
		action: 'add' | 'save' | 'delete';
		code: string;
		name: string;
		id: number;
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const currencyRepository = DependencyInjection.CurrencyRepository;
		const result = getDefaultApiActionResult<string>();

		if (this._data.action !== 'delete') {
			const find = await currencyRepository.findByCodeAndGuildId(
				this._data.code,
				this._data.guild_id
			);

			if (
				find &&
				(this._data.action === 'add' || (this._data.action === 'save' && this._data.id !== find.id))
			) {
				result.error = 'Валюта з таким кодом вже існує';
				return result;
			}
		}

		switch (this._data.action) {
			case 'add':
				const currency = new CurrencyEntity({
					model: {
						id: -1,
						guild_id: this._data.guild_id,
						code: this._data.code,
						name: this._data.name,
						capital: 0
					},
					repository: currencyRepository
				});

				await currencyRepository.save(currency);

				result.success = true;
				result.response = '✅ Валюту додано';

				return result;
			case 'save':
			case 'delete':
				const find = await currencyRepository.findById(this._data.id);
				if (!find || find.guild_id !== this._data.guild_id) {
					result.error = 'Валюту не знайдено';
					return result;
				}

				result.success = true;
				if (this._data.action === 'save') {
					await find.setCode(this._data.code);
					await find.setName(this._data.name);

					result.response = '✅ Валюту відредагувано';
				} else {
					await currencyRepository.delete(find);

					result.response = '✅ Валюту видалено';
				}

				return result;
		}
	}
}
