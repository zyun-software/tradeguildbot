import { DependencyInjection, executeApi } from '$lib/server/application';
import { ApiJson } from '$lib/server/application/api/index.js';
import type { GuildEntity, UserEntity } from '$lib/server/domain';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const token = request.headers.get('x-token') ?? '';
	const data = await request.json();

	const [id, hash] = token.split(':');

	const userRepository = DependencyInjection.UserRepository;
	const guildRepository = DependencyInjection.GuildRepository;

	const result = await executeApi<{ guild: GuildEntity }>({
		findUser: async () => {
			const user_id = parseInt(id);
			if (isNaN(user_id)) {
				return null;
			}

			const user = await userRepository.findById(user_id);

			if (!user || !user.getApiGuildIdByToken(hash)) {
				return null;
			}

			return user;
		},
		createDependencies: async (user: UserEntity) => {
			const guild_id = user.getApiGuildIdByToken(hash) ?? -1;
			const guild = await guildRepository.getById(guild_id);

			return { guild };
		},
		createApi: (user, dependencies) => {
			if (!dependencies?.guild) {
				throw new Error('Потрібно створити сутність гільдії');
			}

			const result = new ApiJson(data.method, data.data, user, dependencies.guild);

			return result;
		}
	});

	return json(result);
}
