import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetGuildAnnouncementUniqueTitlesAction extends ApiAction<
	{ guild_id: number },
	string[]
> {
	public async execute(): Promise<ApiActionExecuteType<string[]>> {
		const result = getDefaultApiActionResult<string[]>();

		const repository = DependencyInjection.AnnouncementRepository;

		result.success = true;
		result.response = await repository.getUniqueTitleList(this._data.guild_id);

		return result;
	}
}
