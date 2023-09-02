import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

type Response = {
	id: number;
	name: string;
}[];

export class FindNotApprovedGuildMembers extends ApiAction<
	{
		guild_id: number;
		name: string;
	},
	Response
> {
	public async execute(): Promise<ApiActionExecuteType<Response>> {
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		const result = getDefaultApiActionResult<Response>();

		const { guild_id, name } = this._data;

		const list = await guildMemberRepository.getNotApprovedListByGuildIdAndName(guild_id, name);

		result.success = true;
		result.response = list.map((item) => {
			return { id: item.id, name: item.name };
		});

		return result;
	}
}
