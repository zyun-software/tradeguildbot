import type { RequestRepository, UserRepository } from '../domain';
import { RequestAdapter, UserAdapter } from '../infrastructure';

export class DependencyInjection {
	public static get UserRepository(): UserRepository {
		const repository = new UserAdapter();

		return repository;
	}

	public static get RequestRepository(): RequestRepository {
		const repository = new RequestAdapter();

		return repository;
	}
}
