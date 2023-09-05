export type PaginationType<TItem> = {
	items: TItem[];
	page: number;
	next: boolean;
};
