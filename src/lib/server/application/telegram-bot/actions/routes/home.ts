import { DONATE_URL, PANEL_URL } from '$env/static/private';
import { DependencyInjection, createTokenUtility } from '$lib/server/application';
import type { UserEntity } from '$lib/server/domain';
import { TelegramBotAction } from '../../interfaces';

export class HomeRoute extends TelegramBotAction {
	private _telegram;

	public constructor() {
		super();
		this._telegram = DependencyInjection.RequestRepository.telegram;
	}

	public async handleExecute(user: UserEntity, response: any): Promise<string | void> {
		const button = {
			donate: '💸 Подякувати'
		};

		switch (response.message.text) {
			case button.donate:
				return await this._telegram('sendMessage', {
					chat_id: user.id,
					text: `[Посилання для пожертв](${DONATE_URL})`
				});
			default:
				const token = createTokenUtility(user.id, 'panel');

				await this._telegram('setChatMenuButton', {
					chat_id: user.id,
					menu_button: {
						type: 'web_app',
						text: 'Панель',
						web_app: {
							url: `${PANEL_URL}?token=${token}`
						}
					}
				});

				await this._telegram('sendMessage', {
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
