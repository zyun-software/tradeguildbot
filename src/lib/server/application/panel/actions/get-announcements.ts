import type { AnnouncementEntity } from '$lib/server/domain';
import type { Announcement, Pagination } from '$lib/types';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

export class GetAnnouncementsAction extends ApiAction<
	{
		guild_id: number;
		personal: boolean;
		page: number;
	},
	Pagination<Announcement> | Announcement
> {
	public async execute(): Promise<ApiActionExecuteType<Pagination<Announcement | Announcement>>> {
		const result = getDefaultApiActionResult<Pagination<Announcement | Announcement>>(
			'Передані не всі параметри для пошуку'
		);

		const mapper = (entity: AnnouncementEntity): Announcement => {
			return {
				id: entity.id,
				title: entity.title,
				description: entity.description,
				seller: entity.seller
			};
		};

		const announcementRepository = DependencyInjection.AnnouncementRepository;

		if (this._data.personal) {
			const guildMemberRepository = DependencyInjection.GuildMemberRepository;
			const guildMember = await guildMemberRepository.getByUserIdAndGuildId(
				this._user.id,
				this._data.guild_id
			);

			const pagination = await announcementRepository.getByGuildMemberIdList(
				guildMember.id,
				this._data.page
			);

			result.success = true;
			result.response = {
				items: pagination.items.map(mapper),
				page: pagination.page,
				next: pagination.next
			};

			return result;
		}

		return result;
	}
}
