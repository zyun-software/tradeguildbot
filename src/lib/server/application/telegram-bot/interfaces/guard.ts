export interface GuardInterface {
	audit(): Promise<boolean>;
}
