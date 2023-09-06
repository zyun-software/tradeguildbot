import { DONATE_URL, PANEL_URL } from '$env/static/private';
import { DependencyInjection } from '$lib/server/application';
import type { UserEntity } from '$lib/server/domain';
import { TelegramBotAction } from '../../interfaces';

export class HomeRoute extends TelegramBotAction<any> {
	public async handleExecute(user: UserEntity): Promise<string | void> {
		const telegram = DependencyInjection.RequestRepository.telegram;
		const button = {
			donate: '💸 Подякувати'
		};

		switch (this._data.message.text) {
			case button.donate:
				return await telegram('sendMessage', {
					chat_id: user.id,
					text: `[Посилання для пожертв](${DONATE_URL})`
				});
			default:
				await telegram('setChatMenuButton', {
					chat_id: user.id,
					menu_button: {
						type: 'web_app',
						text: 'Панель',
						web_app: {
							url: PANEL_URL
						}
					}
				});

				await telegram('sendMessage', {
					chat_id: user.id,
					text: '💡 Для того щоб отримати повний доступ до усіх можливостей, натисніть на кнопку *Панель*',
					reply_markup: {
						keyboard: [[button.donate]],
						resize_keyboard: true
					}
				});
		}
	}
}
