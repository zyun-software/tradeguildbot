import type { AnnouncementEntity } from '$lib/server/domain';
import type { Announcement, Pagination } from '$lib/types';
import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';
import { DependencyInjection } from '../../dependency-injection';

type TResponse = Pagination<Announcement> | Pagination<string> | Announcement[];

export class GetAnnouncementsAction extends ApiAction<
	{
		guild_id: number;
		personal?: boolean;
		titlePart?: string;
		title?: string;
		page: number;
	},
	TResponse
> {
	public async execute(): Promise<ApiActionExecuteType<TResponse>> {
		const result = getDefaultApiActionResult<TResponse>('Передані не всі параметри для пошуку');

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

		if (typeof this._data.titlePart === 'string') {
			const pagination = await announcementRepository.getUniqueTitlesByTitlePartAndGuildId(
				this._data.titlePart,
				this._data.guild_id,
				this._data.page
			);

			if (!pagination.items.length) {
				result.error = 'Оголошення не знайдено';
				return result;
			}

			result.success = true;
			result.response = pagination;

			return result;
		}

		if (typeof this._data.title === 'string') {
			result.success = true;
			result.response = (
				await announcementRepository.getListByTitleAndGuildId(this._data.title, this._data.guild_id)
			).map(mapper);

			return result;
		}

		return result;
	}
}
