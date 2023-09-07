import { GuildEntity, GuildMemberEntity } from '$lib/server/domain';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

type Response = {
	new_guild_id: number;
	message: string;
};

export class WipeAction extends ApiAction<{ guild_id: number }, Response> {
	public async execute(): Promise<ApiActionExecuteType<Response>> {
		const guildRepository = DependencyInjection.GuildRepository;
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const result = getDefaultApiActionResult<Response>();

		const guild = await guildRepository.getById(this._data.guild_id);
		const guildMember = await guildMemberRepository.findByUserIdAndGuildId(
			guild.owner_id,
			guild.id
		);

		if (!guildMember) {
			result.error = 'Не знайдено власника гільдії';
			return result;
		}

		await guildRepository.delete(guild);

		const newGuild = await guildRepository.save(
			new GuildEntity({
				model: {
					id: -1,
					name: guild.name,
					owner_id: guild.owner_id,
					active: guild.active
				},
				repository: guildRepository
			})
		);

		await guildMemberRepository.save(
			new GuildMemberEntity({
				model: {
					id: -1,
					user_id: guildMember.user_id,
					guild_id: newGuild.id,
					name: guildMember.name,
					approved: guildMember.approved
				},
				repository: guildMemberRepository
			})
		);

		if (this._user.data.selectedGuildId === guild.id) {
			await this._user.setData({
				...this._user.data,
				selectedGuildId: newGuild.id
			});
		}

		result.success = true;
		result.response = {
			new_guild_id: newGuild.id,
			message: '✅ Вайп виконано'
		};

		return result;
	}
}
