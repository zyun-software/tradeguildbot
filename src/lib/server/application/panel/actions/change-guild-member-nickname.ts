import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';
import { regex } from '../../regex';

export class ChangeGuildMemberNicknameAction extends ApiAction<
	{
		guild_id: number;
		old: string;
		new: string;
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const guildRepository = DependencyInjection.GuildRepository;
		const guildMemberRepository = DependencyInjection.GuildMemberRepository;
		const telegram = DependencyInjection.RequestRepository.telegram;
		const result = getDefaultApiActionResult<string>();

		if (!regex.minecraftNickname.test(this._data.new)) {
			result.error = 'Потрібно вказати вірний формат псевдоніму';
			return result;
		}

		const exists = await guildMemberRepository.findByNameAndGuildId(
			this._data.new,
			this._data.guild_id
		);

		if (exists) {
			result.error = 'Такий псевдонім вже використовується';
			return result;
		}

		const find = await guildMemberRepository.findByNameAndGuildId(
			this._data.old,
			this._data.guild_id
		);

		if (!find) {
			result.error = 'Члена гільдії, за вказаним псевдонімом, не знайдено';
			return result;
		}

		const guild = await guildRepository.getById(find.guild_id);

		const oldNickname = find.name;
		await find.setName(this._data.new);
		await telegram('sendMessage', {
			chat_id: find.user_id,
			text: `✍🏻 Ваш псевдонім було змінено в гільдії *${guild.name}* з *${oldNickname}* на *${find.name}*`
		});

		result.success = true;
		result.response = '✅ Псевдонім було змінено';

		return result;
	}
}
