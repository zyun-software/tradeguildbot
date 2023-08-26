import { GuildMemberEntity } from '$lib/server/domain';
import { ApiAction, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';
import { regex } from '../../regex';

export class RegistrationInGuildAction extends ApiAction<{
	guild_id: number;
	nickname: string;
}> {
	public async execute(): Promise<ApiActionExecuteType> {
		const guildRepository = DependencyInjection.GuildRepository;
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const telegram = DependencyInjection.RequestRepository.telegram;

		const result: {
			success: boolean;
			error: string;
			response: null | { message: string };
		} = {
			success: false,
			error: '',
			response: null
		};

		if (typeof this._data.guild_id !== 'number') {
			result.error = 'Необхідно передати ідентифікатор гільдії';
			return result;
		}

		if (typeof this._data.nickname !== 'string') {
			result.error = 'Необхідно передати псевдонім';
			return result;
		}

		const guild = await guildRepository.findById(this._data.guild_id);

		if (!guild) {
			result.error = 'Не знайдено гільдію за вказаним ідентифікатором';
			return result;
		}

		if (!regex.minecraftNickname.test(this._data.nickname)) {
			result.error = 'Потрібно вказати вірний формат псевдоніму';
			return result;
		}

		const guildMemberByName = await guildMemberRepository.findByNameAndGuildId(
			this._data.nickname,
			guild.id
		);

		if (guildMemberByName) {
			result.error = 'Такий псевдонім вже використовується';
			return result;
		}

		const guildMemberByUserId = await guildMemberRepository.findByUserIdAndGuildId(
			this._user.id,
			guild.id
		);

		if (guildMemberByUserId) {
			result.error = `Ви вже подали заявку на вступ до гільдії ${guild.name}`;
			return result;
		}

		await guildMemberRepository.save(
			new GuildMemberEntity({
				model: {
					id: -1,
					user_id: this._user.id,
					guild_id: this._data.guild_id,
					name: this._data.nickname,
					approved: false
				},
				repository: guildMemberRepository
			})
		);

		await telegram('sendMessage', {
			chat_id: guild.owner_id,
			text: `📥 Отримано заявку на вступ в гільдію *${guild.name}* від \`${this._data.nickname}\``
		});

		result.success = true;
		result.response = {
			message: `✅ Заявку на вступ в гільдію ${guild.name} подано`
		};

		return result;
	}
}
