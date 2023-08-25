import type { GuardInterface } from './guard';

type GuardsType = GuardInterface[] | [];

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
}
