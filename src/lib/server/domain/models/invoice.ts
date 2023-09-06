import { Entity, RepositoryId, type PaginationType, type RepositorySave } from '$lib/server/core';
import type { AccountEntity } from './account';

export abstract class InvoiceRepository
	extends RepositoryId<InvoiceEntity>
	implements RepositorySave<InvoiceEntity>
{
	public abstract updatePaid(entity: InvoiceEntity): Promise<InvoiceEntity>;

	public abstract countByAccountIds(
		seller_account_id: number,
		payer_account_id: number
	): Promise<number>;

	public abstract getSellerAccount(entity: InvoiceEntity): Promise<AccountEntity>;
	public abstract getPayerAccount(entity: InvoiceEntity): Promise<AccountEntity>;

	public abstract getListBySellerMemberIdAndCurrencyIdAndNamePart(
		member_id: number,
		currency_id: number,
		paid: boolean,
		name: string,
		page: number
	): Promise<PaginationType<InvoiceEntity>>;
	public abstract getListByPayerMemberIdAndCurrencyIdAndNamePart(
		member_id: number,
		currency_id: number,
		paid: boolean,
		name: string,
		page: number
	): Promise<PaginationType<InvoiceEntity>>;

	public abstract save(entity: InvoiceEntity): Promise<InvoiceEntity>;
	public abstract delete(entity: InvoiceEntity): Promise<void>;
}

export type InvoiceModel = {
	id: number;
	seller_account_id: number;
	payer_account_id: number;
	amount: number;
	purpose: string;
	paid: boolean;
};

export class InvoiceEntity extends Entity<InvoiceModel, InvoiceRepository> {
	public get seller_account_id(): number {
		return this.__model.seller_account_id;
	}

	public get payer_account_id(): number {
		return this.__model.payer_account_id;
	}

	public get amount(): number {
		return this.__model.amount;
	}

	public get purpose(): string {
		return this.__model.purpose;
	}

	public get paid(): boolean {
		return this.__model.paid;
	}

	public async setPaid(value: boolean): Promise<InvoiceEntity> {
		this.__model.paid = value;
		if (this.__created) {
			await this.__repository.updatePaid(this);
		}

		return this;
	}

	public async getSellerAccount(): Promise<AccountEntity> {
		const account = await this.__repository.getSellerAccount(this);

		return account;
	}

	public async getPayerAccount(): Promise<AccountEntity> {
		const account = await this.__repository.getPayerAccount(this);

		return account;
	}
}
