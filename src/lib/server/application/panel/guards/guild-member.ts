import { GuardInterface } from '$lib/server/core';
import { DependencyInjection } from '../../dependency-injection';

export class GuildMemberGuard extends GuardInterface<{
	guild_id: number;
}> {
	public async audit(): Promise<boolean> {
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		const me = await guildMemberRepository.findByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

		if (!me || !me.approved) {
			return false;
		}

		return true;
	}
}
