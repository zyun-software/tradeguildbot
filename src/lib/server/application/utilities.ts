import { TG_TOKEN } from '$env/static/private';
import type { UserEntity } from '$lib/server/domain';
import { createHmac } from 'crypto';
import uuid from 'uuid-random';
import { DependencyInjection } from './dependency-injection';

export async function findUserByTelegramWebAppInitData(
	initData: string
): Promise<UserEntity | null> {
	const encoded = decodeURIComponent(initData);

	const secret = createHmac('sha256', 'WebAppData').update(TG_TOKEN);

	const arr = encoded.split('&');
	const hashIndex = arr.findIndex((str) => str.startsWith('hash='));
	const hash = arr.splice(hashIndex)[0].split('=')[1];
	arr.sort((a, b) => a.localeCompare(b));
	const dataCheckString = arr.join('\n');

	const _hash = createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');

	const valid = _hash === hash;
	const userField = arr.find((str) => str.startsWith('user='));

	if (!valid || !userField) {
		return null;
	}

	const userId = JSON.parse(decodeURIComponent(userField.split('=')[1])).id;

	const userRepository = DependencyInjection.UserRepository;

	const user = await userRepository.findById(userId);

	return user;
}

export async function findUserByApiTokenUtility(token: string): Promise<UserEntity | null> {
	const userRepository = DependencyInjection.UserRepository;

	let [id, hash] = token.split(':');

	const user_id = parseInt(id);

	if (isNaN(user_id)) {
		return null;
	}

	const entity = await userRepository.findById(user_id);

	if (!entity || !entity.data.apiToken || typeof entity.data.apiToken[hash] !== 'number') {
		return null;
	}

	return entity;
}

export async function createApiTokenUtility(user: UserEntity, guild_id: number): Promise<string> {
	const hash = uuid();

	const token = `${user.id}:${hash}`;

	await user.setApiToken(hash, guild_id);

	return token;
}
