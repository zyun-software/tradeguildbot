import type { GuildType } from '$lib/types';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetGuildsAction extends ApiAction<{}, GuildType[]> {
	public async execute(): Promise<ApiActionExecuteType<GuildType[]>> {
		const guildRepository = DependencyInjection.GuildRepository;
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		const result = getDefaultApiActionResult<GuildType[]>();

		const guilds: GuildType[] = [];

		const guildMembers = await guildMemberRepository.getListByUserId(this._user.id);
		const guildEntities = await guildRepository.getActiveList();

		for (const entity of guildEntities) {
			const guildMember = guildMembers.find((item) => item.guild_id === entity.id);
			guilds.push({
				id: entity.id,
				name: entity.name,
				isOwner: entity.owner_id === this._user.id,
				isMember: guildMember !== undefined && guildMember.approved,
				nickname: guildMember?.name ?? ''
			});
		}

		result.success = true;
		result.response = guilds;

		return result;
	}
}
