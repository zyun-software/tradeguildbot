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

		const guildMember = await guildMemberRepository.getByUserIdAndGuildId(
			this._user.id,
			this._data.guild_id
		);

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
						.setDescription(this._data.description ?? '')
						.then((a) => a.setSeller(this._data.seller ?? ''))
						.then((a) => a.setTitle(this._data.title ?? ''));

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
