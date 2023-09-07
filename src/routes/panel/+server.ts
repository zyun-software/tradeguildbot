import { Panel, findUserByTelegramWebAppInitData } from '$lib/server/application';
import { executeApi } from '$lib/server/application/api.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const initData = request.headers.get('x-telegram-web-app-init-data') ?? '';
	const data = await request.json();
	const result = await executeApi({
		findUser: () => findUserByTelegramWebAppInitData(initData),
		createApi: (user) => new Panel(data.method, data.data, user)
	});
	return json(result);
}
