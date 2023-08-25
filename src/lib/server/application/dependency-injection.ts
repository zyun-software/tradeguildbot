import type {
	GuildMemberRepository,
	GuildRepository,
	RequestRepository,
	UserRepository
} from '../domain';
import { GuildAdapter, GuildMemberAdapter, RequestAdapter, UserAdapter } from '../infrastructure';

export class DependencyInjection {
	public static get UserRepository(): UserRepository {
		const adapter = new UserAdapter();

		return adapter;
	}

	public static get RequestRepository(): RequestRepository {
		const adapter = new RequestAdapter();

		return adapter;
	}

	public static get GuildRepository(): GuildRepository {
		const adapter = new GuildAdapter();

		return adapter;
	}

	public static get GuildMemberRepository(): GuildMemberRepository {
		const adapter = new GuildMemberAdapter();

		return adapter;
	}
}
