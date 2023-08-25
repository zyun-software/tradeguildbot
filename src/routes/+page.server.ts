import { DependencyInjection, findUserByTokenUtility } from '$lib/server/application';
import type { GuildMemberEntity } from '$lib/server/domain/index.js';
import type { GuildType } from '$lib/types.js';

export async function load({ url, cookies }) {
	const guildRepository = DependencyInjection.GuildRepository;
	const guildMemberRepository = DependencyInjection.GuildMemberRepository;

	let token = url.searchParams.get('token');

	if (token) {
		cookies.set('token', token, { path: '/' });
	}

	token = cookies.get('token') ?? '';

	const user = await findUserByTokenUtility(token, 'panel');
	const unauthorized = !user;

	const guilds: GuildType[] = [];

	let guildMembers: GuildMemberEntity[] = [];

	if (user) {
		guildMembers = await guildMemberRepository.getListByUserId(user.id);
	}

	const guildEntities = await guildRepository.getActiveList();
	for (const entity of guildEntities) {
		const guildMember = guildMembers.find((item) => item.guild_id === entity.id);
		guilds.push({
			id: entity.id,
			name: entity.name,
			isOwner: !!user && entity.owner_id === user.id,
			isMember: guildMember !== undefined && guildMember.approved,
			nickname: guildMember?.name ?? ''
		});
	}

	let selectedGuildId = user ? user.data.selectedGuildId ?? null : null;

	return {
		token,
		unauthorized,
		guilds,
		selectedGuildId
	};
}
