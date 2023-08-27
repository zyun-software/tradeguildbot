import { ApiAction, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetGuildMemberNicknamesAction extends ApiAction<{
	guild_id: number;
}> {
	public async execute(): Promise<ApiActionExecuteType> {
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const result: {
			success: boolean;
			error: string;
			response: null | string[];
		} = {
			success: false,
			error: '',
			response: null
		};

		const list = await guildMemberRepository.getApprovedListByGuildId(this._data.guild_id);

		result.success = true;
		result.response = list.map((item) => item.name);

		return result;
	}
}
