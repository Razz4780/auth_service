import {QueryConfig, QueryResult} from "pg";

export interface IDatabase {
    query(config: QueryConfig): Promise<QueryResult>;

    close(): Promise<void>;
}
