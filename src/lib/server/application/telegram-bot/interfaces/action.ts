import type { GuardInterface } from './guard';

type GuardsType = GuardInterface[] | [];

export abstract class ActionInterace {
	private _guards: GuardsType;

	public get guards(): GuardsType {
		return this._guards;
	}

	public constructor(guards: GuardsType) {
		this._guards = guards;
	}

	public abstract execute(): Promise<void>;
}
