import {hashSync, compareSync} from "bcrypt";

export class User {
    private readonly id: number | undefined;
    private username: string;
    private passHash: string;
    private active: boolean;

    constructor(
        id: number | undefined,
        username: string,
        passHash: string,
        active: boolean
    ) {
        this.id = id;
        this.username = username;
        this.passHash = passHash;
        this.active = active;
    }

    public static newUser(username: string, password: string) {
        return new User(undefined, username, hashSync(password, 10), true);
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getUsername(): string {
        return this.username;
    }

    public getPassHash(): string {
        return this.passHash;
    }

    public isActive(): boolean {
        return this.active;
    }

    public update(data: { username?: string, password: string, active: boolean }): void {
        if (data.username !== undefined) {
            this.username = data.username;
        }
        if (data.password !== undefined) {
            this.passHash = hashSync(data.password, 10);
        }
        if (data.active !== undefined) {
            this.active = data.active;
        }
    }

    public checkPassword(password: string): boolean {
        return compareSync(password, this.passHash);
    }
}
