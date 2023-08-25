import axios from 'axios';
import Unauthorized from './components/pages/unauthorized.svelte';
import { pageComponent } from './stores';

export function alertUtility(message: any): void {
	const webApp = window?.Telegram?.WebApp;
	if (webApp) {
		webApp.showAlert(message);
	} else {
		alert(message);
	}
}

export function hideTelegramWebAppButton(): void {
	const webApp = window?.Telegram?.WebApp;
	if (webApp) {
		webApp.MainButton.hide();
	}
}

export function showTelegramWebAppButton(text: string, handler: () => Promise<void> | void): void {
	const webApp = window?.Telegram?.WebApp;
	if (webApp) {
		const MainButton = webApp.MainButton;
		MainButton.text = text;
		MainButton.show();
		MainButton.onClick(handler);
	}
}

export async function requestUtility<TResponse>(
	method: string,
	data: object = {}
): Promise<TResponse | null> {
	try {
		const serverResponse = await axios.post<{
			unauthorized: boolean;
			success: boolean;
			error: string;
			response: TResponse;
		}>('/panel', {
			method,
			data
		});

		const { unauthorized, success, error, response } = serverResponse.data;

		if (unauthorized) {
			pageComponent.set(Unauthorized);
			return null;
		}

		if (!success) {
			alertUtility(`💥 ${error}`);
			return null;
		}

		return response;
	} catch {
		alertUtility('💥 Помилка відправки запиту');
		return null;
	}
}
