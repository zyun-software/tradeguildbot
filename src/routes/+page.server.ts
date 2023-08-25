import { DependencyInjection, findUserByTokenUtility } from '$lib/server/application';
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

	const guildMembers = await guildMemberRepository.getApprovedListByUserId(user ? user.id : -1);

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

	let selectedGuildId: number | null = user ? user.data.selectedGuildId ?? null : null;
	if (user && selectedGuildId && !(selectedGuildId in guilds)) {
		selectedGuildId = null;
		const data = user.data;
		delete data.selectedGuildId;
		await user.setData(data);
	}

	return {
		token,
		unauthorized,
		guilds,
		selectedGuildId
	};
}
