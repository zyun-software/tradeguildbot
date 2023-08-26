import { ApiAction, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class FindNotApprovedGuildMembers extends ApiAction<{
	guild_id: number;
	name: string;
}> {
	public async execute(): Promise<ApiActionExecuteType> {
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		const result: {
			success: boolean;
			error: string;
			response:
				| null
				| {
						id: number;
						name: string;
				  }[];
		} = {
			success: false,
			error: '',
			response: null
		};

		const { guild_id, name } = this._data;

		const list = await guildMemberRepository.getNotApprovedListByGuildIdAndName(guild_id, name);

		result.success = true;
		result.response = list.map((item) => {
			return { id: item.id, name: item.name };
		});

		return result;
	}
}
