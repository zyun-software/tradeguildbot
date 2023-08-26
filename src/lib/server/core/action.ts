import type { UserEntity } from '../domain';
import type { GuardInterface } from './guard';

type GuardsType = GuardInterface<any>[] | [];

export abstract class ActionInterace<TData> {
	public constructor(
		protected _guards: GuardsType,
		protected _user: UserEntity,
		protected _data: TData
	) {}

	public async auditAccess(): Promise<boolean> {
		for (const guard of this._guards) {
			const haveAccess = await guard.audit();
			if (haveAccess) {
				return true;
			}
		}

		return !this._guards.length;
	}
}
