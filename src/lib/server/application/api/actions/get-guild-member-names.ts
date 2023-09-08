import { getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';
import { ApiJsonAction } from '../interfaces';

export class GetGuildMemberNamesAction extends ApiJsonAction<{}, string[]> {
	public async execute(): Promise<ApiActionExecuteType<string[]>> {
		const result = getDefaultApiActionResult<string[]>();

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		result.success = true;
		result.response = (await guildMemberRepository.getApprovedListByGuildId(this._guild.id)).map(
			(entity) => entity.name
		);

		return result;
	}
}
