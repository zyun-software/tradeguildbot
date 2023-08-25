import {
	UserDefaultValue,
	UserEntity,
	UserRepository,
	type RequestRepository
} from '$lib/server/domain';
import { DependencyInjection } from '../dependency-injection';
import { HomeRoute } from './actions';
import type { TelegramBotAction } from './interfaces';

type ActionsType = { [k: string]: TelegramBotAction };

export class TelegramBot {
	private _request: any;
	private _routes: ActionsType;

	private _userRepository: UserRepository;
	private _requestRepository: RequestRepository;

	public constructor(request: any) {
		this._request = request;

		this._userRepository = DependencyInjection.UserRepository;
		this._requestRepository = DependencyInjection.RequestRepository;

		this._routes = {
			home: new HomeRoute()
		};
	}

	public async start() {
		const message = this._request.message;
		if (message) {
			if (message.chat.type === 'private') {
				const user = await this._getUserById(message.from.id);
				await this._executeAction({
					name: user.route,
					user,
					actions: this._routes,
					updateRoute: true
				});

				return;
			}
		}
	}

	private async _executeAction(options: {
		name: string;
		user: UserEntity;
		actions: ActionsType;
		updateRoute?: boolean;
		notFoundMessage?: string;
	}): Promise<void> {
		const redirect = async (name: string) => {
			options.name = name;
			await user.setRoute(options.name);
			await this._executeAction(options);
		};

		const { name, user, actions, updateRoute, notFoundMessage } = options;

		if (name in actions) {
			const action = actions[name];
			const haveAccess = await action.auditAccess();
			if (haveAccess) {
				const result = await action.handleExecute(user, this._request);
				if (updateRoute && typeof result === 'string') {
					await redirect(result);
				}
			} else {
				await action.handleAccessDenied(user, this._request);
			}
		} else if (updateRoute) {
			await redirect('home');
		} else {
			await this._requestRepository.telegram('sendMessage', {
				chat_id: user.id,
				text: notFoundMessage ?? '❗ Дію не знайдено'
			});
		}
	}

	private async _getUserById(id: number): Promise<UserEntity> {
		const repository = this._userRepository;
		const user = await repository.findById(id);
		if (user) {
			return user;
		}

		const entity = new UserEntity({
			model: {
				id,
				...UserDefaultValue
			},
			repository
		});

		const newUser = await repository.save(entity);

		return newUser;
	}
}
