import { GuardInterface } from '$lib/server/core';
import { DependencyInjection } from '../../dependency-injection';

export class GuildMasterGuard extends GuardInterface<{ guild_id: number }> {
	public async audit(): Promise<boolean> {
		const guildRepository = DependencyInjection.GuildRepository;

		const guild = await guildRepository.findByOwnerId(this._user.id);

		if (!guild) {
			return false;
		}

		if (guild.id !== this._data.guild_id) {
			return false;
		}

		return true;
	}
}
