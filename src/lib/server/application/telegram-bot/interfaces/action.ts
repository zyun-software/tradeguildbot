import type { UserEntity } from '$lib/server/domain';
import type { GuardInterface } from './guard';

type GuardsType = GuardInterface[] | [];
type HandleType = Promise<void | string>;

export abstract class ActionInterace {
	protected _guards: GuardsType;

	public constructor(guards: GuardsType = []) {
		this._guards = guards;
	}

	public async auditAccess(): Promise<boolean> {
		for (const guard of this._guards) {
			const haveAccess = await guard.audit();
			if (haveAccess) {
				return true;
			}
		}

		return !this._guards.length;
	}

	public abstract handleExecute(user: UserEntity, response: any): HandleType;

	public async handleAccessDenied(user: UserEntity, response: any): HandleType {}
}
