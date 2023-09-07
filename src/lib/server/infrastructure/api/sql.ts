import { PG_DB, PG_PASSWORD, PG_USER } from '$env/static/private';
import postgres from 'postgres';

export const sql = postgres({
	host: 'postgres',
	port: 5432,
	database: PG_DB,
	username: PG_USER,
	password: PG_PASSWORD
});
