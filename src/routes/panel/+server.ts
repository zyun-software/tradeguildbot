import { Panel } from '$lib/server/application';
import { executeApi } from '$lib/server/application/api.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const token = cookies.get('token') ?? '';
	const data = await request.json();
	const result = await executeApi(
		token,
		'panel',
		(user) => new Panel(data.method, data.data, user)
	);
	return json(result);
}
