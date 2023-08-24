import { TG_TOKEN } from '$env/static/private';
import type { RequestRepository } from '$lib/server/domain';
import axios from 'axios';

export class RequestAdapter implements RequestRepository {
	public async telegram(method: string, data: any): Promise<any> {
		try {
			const result = await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/${method}`, {
				parse_mode: 'Markdown',
				...data
			});

			return result;
		} catch (error: any) {
			console.log('## Помилка запиту до Telegram');

			if (error.response) {
				console.log('Статус відмови:', error.response.status);
				console.log('Дані відповіді:', error.response.data);
			} else if (error.request) {
				console.log('Помилка запиту:', error.request);
			} else {
				console.log('Помилка налаштування:', error.message);
			}

			error.config.data = JSON.parse(error.config.data);
			console.log('Додаткові деталі про помилку:', error.config);
		}
	}
}
