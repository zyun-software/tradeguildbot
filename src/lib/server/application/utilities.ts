import { TG_TOKEN } from '$env/static/private';
import type { UserEntity } from '$lib/server/domain';
import * as jwt from 'jsonwebtoken';
import { DependencyInjection } from './dependency-injection';

export async function findUserByTokenUtility(
	token: string,
	type: 'panel' | 'api'
): Promise<UserEntity | null> {
	const userRepository = DependencyInjection.UserRepository;

	try {
		const decoded: any = jwt.verify(token, TG_TOKEN);

		if (decoded.type !== type) {
			return null;
		}

		const entity = await userRepository.findById(decoded.userId);

		return entity;
	} catch {}

	return null;
}

export function createTokenUtility(userId: number, type: 'panel' | 'api'): string {
	const token = jwt.sign(
		{
			userId,
			type
		},
		TG_TOKEN,
		{ expiresIn: '100y' }
	);

	return token;
}
