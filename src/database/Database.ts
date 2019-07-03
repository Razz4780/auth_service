import {IDatabase} from "./IDatabase";
import {Pool, QueryResult, QueryConfig} from "pg";

export class Database implements IDatabase {
    private readonly pool: Pool;

    constructor(user: string, db: string, password: string, host: string, port: number) {
        this.pool = new Pool({
            user: user,
            database: db,
            password: password,
            host: host,
            port: port,
            connectionTimeoutMillis: 10000,
        });
    }

    public async query(config: QueryConfig): Promise<QueryResult> {
        return this.pool.query(config);
    }

    public async close(): Promise<void> {
        return this.pool.end();
    }
}
