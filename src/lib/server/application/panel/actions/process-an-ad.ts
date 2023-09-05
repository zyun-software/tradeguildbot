import { AnnouncementEntity } from '$lib/server/domain';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class ProcessAnAdAction extends ApiAction<
	{
		guild_id: number;
		action: 'delete' | 'save' | 'create';
		id?: number;
		title?: string;
		description?: string;
		seller?: string;
	},
	string
> {
	public async execute(): Promise<ApiActionExecuteType<string>> {
		const result = getDefaultApiActionResult<string>('Дію для обробки оголошення не знайдено');

		const guildMemberRepository = DependencyInjection.GuildMemberRepository;

		const guildMember = await guildMemberRepository.findByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

		if (!guildMember) {
			result.error = 'Учасника гільдії не знайдено';
			return result;
		}

		const announcementRepository = DependencyInjection.AnnouncementRepository;

		try {
			if (this._data.action === 'create') {
				let announcement: AnnouncementEntity;

				announcement = new AnnouncementEntity({
					model: {
						id: -1,
						guild_member_id: guildMember.id,
						title: this._data.title ?? '',
						description: this._data.description ?? '',
						seller: this._data.seller ?? ''
					},
					repository: announcementRepository
				});

				await announcementRepository.save(announcement);

				result.success = true;
				result.response = '✅ Оголошення створено';

				return result;
			} else {
				console.log(this._data);
				const announcement = await announcementRepository.findById(this._data.id ?? -1);

				if (!announcement || announcement.guild_member_id !== guildMember.id) {
					result.error = 'Оголошення не знайдено';
					return result;
				}

				if (this._data.action === 'delete') {
					await announcementRepository.delete(announcement);

					result.success = true;
					result.response = '✅ Оголошення видалено';

					return result;
				} else {
					await announcement
						.setTitle(this._data.title ?? '')
						.then((announcement) => announcement.setDescription(this._data.description ?? ''))
						.then((announcement) => announcement.setSeller(this._data.seller ?? ''));

					result.success = true;
					result.response = '✅ Оголошення відредаговано';

					return result;
				}
			}
		} catch (error: any) {
			result.error = error.message;
			return result;
		}
	}
}
