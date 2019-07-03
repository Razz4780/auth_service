import {IDatabase} from "../database/IDatabase";
import {compareSync} from "bcrypt";

export class AdminObjects {
    private readonly db: IDatabase;

    constructor(db: IDatabase) {
        this.db = db;
    }

    public async authenticate(id: number, password: string): Promise<boolean> {
        const queryResults = await this.db.query({
            text: "SELECT * FROM auth_admins WHERE id = $1",
            values: [id],
        });
        if (queryResults.rowCount === 0) {
            return false;
        }
        return compareSync(password, queryResults.rows[0].pass_hash);
    }
}
