import {
	MoneyService,
	type AccountRepository,
	type CurrencyRepository,
	type GuildMemberRepository,
	type GuildRepository,
	type RequestRepository,
	type UserRepository
} from '../domain';
import {
	AccountAdapter,
	CurrencyAdapter,
	GuildAdapter,
	GuildMemberAdapter,
	RequestAdapter,
	UserAdapter
} from '../infrastructure';

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

	public static get CurrencyRepository(): CurrencyRepository {
		const adapter = new CurrencyAdapter();

		return adapter;
	}

	public static get AccountRepository(): AccountRepository {
		const adapter = new AccountAdapter();

		return adapter;
	}

	public static get MoneyService(): MoneyService {
		const service = new MoneyService(
			this.AccountRepository,
			this.CurrencyRepository,
			this.GuildMemberRepository
		);

		return service;
	}
}
