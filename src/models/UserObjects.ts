import {IDatabase} from "../database/IDatabase";
import {User} from "./User";
import {QueryConfig} from "pg";

export class UserObjects {
    private readonly db: IDatabase;

    constructor(db: IDatabase) {
        this.db = db;
    }

    private async getUser(config: QueryConfig): Promise<User | undefined> {
        const queryResult = await this.db.query(config);
        if (queryResult.rowCount === 0) {
            return undefined;
        }
        const data = queryResult.rows[0];
        return new User(
            data.id,
            data.username,
            data.pass_hash,
            data.active,
        );
    }

    public async getById(id: number): Promise<User | undefined> {
        return this.getUser({
            text: "SELECT * FROM auth_users WHERE id = $1",
            values: [id],
        });
    }

    public async authenticate(username: string, password: string): Promise<User | undefined> {
        let user = await this.getUser({
            text: "SELECT * FROM auth_users WHERE username = $1 AND active = TRUE",
            values: [username],
        });
        if (user !== undefined && !user.checkPassword(password)) {
            user = undefined;
        }
        return user;
    }

    public async save(user: User): Promise<void> {
        if (user.getId() === undefined) {
            await this.db.query({
                text: "INSERT INTO auth_users (username, pass_hash, active) " +
                    "VALUES ($1, $2, $3)",
                values: [user.getUsername(), user.getPassHash(), user.isActive()],
            })
        } else {
            await this.db.query({
                text: "UPDATE auth_users SET username = $1, pass_hash = $2, active = $3 " +
                    "WHERE id = $4",
                values: [user.getUsername(), user.getPassHash(), user.isActive(), user.getId()],
            })
        }
    }
}
