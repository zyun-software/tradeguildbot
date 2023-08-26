import { ApiAction, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class ProcessJoiningTheGuildAction extends ApiAction<{
	guild_id: number;
	id: number;
	action: 'approve' | 'reject';
}> {
	public async execute(): Promise<ApiActionExecuteType> {
		const guildRepository = DependencyInjection.GuildRepository;
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const telegram = DependencyInjection.RequestRepository.telegram;
		const result: {
			success: boolean;
			error: string;
			response: null | string;
		} = {
			success: false,
			error: 'Невідома дія',
			response: null
		};

		const guildMember = await guildMemberRepository.findById(this._data.id);
		if (!guildMember) {
			result.error = 'Заявку не знайдено';
			return result;
		}

		if (guildMember.guild_id !== this._data.guild_id) {
			result.error = 'Ви не маєте дозволу на обробку цієї заявки';
			return result;
		}

		const guild = await guildRepository.getById(guildMember.guild_id);

		switch (this._data.action) {
			case 'approve':
				await guildMember.setApproved(true);
				await telegram('sendMessage', {
					chat_id: guildMember.user_id,
					text: `✅ Вашу заявку на вступ до гільдії *${guild.name}* схвалено`
				});
				result.success = true;
				result.response = '✅ Заявку на вступ схвалено';
				return result;
			case 'reject':
				await guildMemberRepository.delete(guildMember);
				await telegram('sendMessage', {
					chat_id: guildMember.user_id,
					text: `🚫 Вашу заявку на вступ до гільдії *${guild.name}* відхилено`
				});
				result.success = true;
				result.response = '🚫 Заявку на вступ відхилено';
		}

		return result;
	}
}
