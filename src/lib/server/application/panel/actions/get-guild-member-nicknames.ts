import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetGuildMemberNicknamesAction extends ApiAction<
	{
		guild_id: number;
	},
	string[]
> {
	public async execute(): Promise<ApiActionExecuteType<string[]>> {
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const result = getDefaultApiActionResult<string[]>();

		const list = await guildMemberRepository.getApprovedListByGuildId(this._data.guild_id);

		result.success = true;
		result.response = list.map((item) => item.name);

		return result;
	}
}
