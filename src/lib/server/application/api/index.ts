import type { GuildEntity, UserEntity } from '$lib/server/domain';
import { Api } from '../api';
import {
	CreateInvoiceAction,
	GetCurrenciesAction,
	GetInvoiceAction,
	TransactionAction
} from './actions';

export class ApiJson extends Api {
	public constructor(method: string, data: any, user: UserEntity, guild: GuildEntity) {
		super(method, data, user);

		this._actions = {
			'create-invoice': new CreateInvoiceAction([], data, user, guild),
			'get-currencies': new GetCurrenciesAction([], data, user, guild),
			'get-invoice': new GetInvoiceAction([], data, user, guild),
			transaction: new TransactionAction([], data, user, guild)
		};
	}
}
