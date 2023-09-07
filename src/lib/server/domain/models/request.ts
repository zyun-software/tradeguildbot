export interface RequestRepository {
	telegram(method: string, data: any): Promise<any>;
}
