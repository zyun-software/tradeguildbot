import {
	GuildMemberEntity,
	type GuildMemberRepository,
	type GuildRepository,
	type UserEntity
} from '$lib/server/domain';
import { ApiAction, type ApiActionExecuteType } from '../api';
import { DependencyInjection } from '../dependency-injection';
import { regex } from '../regex';

export class RegistrationInGuildAction extends ApiAction {
	private _guildRepository: GuildRepository;
	private _guildMemberRepository: GuildMemberRepository;
	private _telegram;

	public constructor() {
		super();
		this._guildRepository = DependencyInjection.GuildRepository;
		this._guildMemberRepository = DependencyInjection.GuildMemberRepository;
		this._telegram = DependencyInjection.RequestRepository.telegram;
	}

	public async execute(
		user: UserEntity,
		data: {
			guild_id: number;
			nickname: string;
		}
	): Promise<ApiActionExecuteType> {
		const result: {
			success: boolean;
			error: string;
			response: null | { message: string };
		} = {
			success: false,
			error: '',
			response: null
		};

		if (typeof data.guild_id !== 'number') {
			result.error = 'Необхідно передати ідентифікатор гільдії';
			return result;
		}

		if (typeof data.nickname !== 'string') {
			result.error = 'Необхідно передати псевдонім';
			return result;
		}

		const guild = await this._guildRepository.findById(data.guild_id);

		if (!guild) {
			result.error = 'Не знайдено гільдію за вказаним ідентифікатором';
			return result;
		}

		if (!regex.minecraftNickname.test(data.nickname)) {
			result.error = 'Потрібно вказати вірний формат псевдоніму';
			return result;
		}

		const guildMemberByName = await this._guildMemberRepository.findByNameAndGuildId(
			data.nickname,
			guild.id
		);

		if (guildMemberByName) {
			result.error = 'Такий псевдонім вже використовується';
			return result;
		}

		const guildMemberByUserId = await this._guildMemberRepository.findByUserIdAndGuildId(
			user.id,
			guild.id
		);

		if (guildMemberByUserId) {
			result.error = `Ви вже подали заявку на вступ до гільдії ${guild.name}`;
			return result;
		}

		await this._guildMemberRepository.save(
			new GuildMemberEntity({
				model: {
					id: -1,
					user_id: user.id,
					guild_id: data.guild_id,
					name: data.nickname,
					approved: false
				},
				repository: this._guildMemberRepository
			})
		);

		await this._telegram('sendMessage', {
			chat_id: guild.owner_id,
			text: `📥 Отримано заявку на вступ в гільдію *${guild.name}* від \`${data.nickname}\``
		});

		result.success = true;
		result.response = {
			message: `✅ Заявку на вступ в гільдію ${guild.name} подано`
		};

		return result;
	}
}
