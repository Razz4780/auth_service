import {User} from "../models/User";
import {UserObjects} from "../models/UserObjects";
import jsonWebToken from "jsonwebtoken";
import {IPayload} from "./IPayload";
import express, {Router, Request, Response} from "express";
import {ValidationMiddleware} from "../ValidationMiddleware";

export class Tokens {
    private static readonly SECRET: string = process.env.SECRET || "secret";
    private static readonly EXPIRATION: number = 60 * 60 * 24 * 5;
    private static readonly ALGORITHM: string = "HS256";

    private readonly users: UserObjects;

    constructor(users: UserObjects) {
        this.users = users;
    }

    public getRouter(): Router {
        const router = express.Router();
        const credentialsMiddleware = new ValidationMiddleware({
            type: "object",
            properties: {
                username: {
                    type: "string",
                    minLength: 1,
                    maxLength: 64,
                },
                password: {
                    type: "string",
                    minLength: 1,
                    maxLength: 64,
                },
            },
            additionalProperties: false,
            required: ["username", "password"],
        }).getMiddleware();
        router.get(
            "/",
            (req, res) => Tokens.checkToken(req, res),
        );
        router.post(
            "/",
            credentialsMiddleware,
            (req, res) => this.authenticate(req, res),
        );
        return router;
    }

    private async authenticate(req: Request, res: Response): Promise<void> {
        const username = req.body.username;
        const password = req.body.password;
        try {
            const user = await this.users.authenticate(username, password);
            if (user === undefined) {
                res.status(401).end();
            } else {
                const token = Tokens.createToken(user);
                res.json({token: token});
            }
        } catch (e) {
            res.status(500).end();
        }
    }

    private static checkToken(req: Request, res: Response): void {
        const token = req.header("Authorization");
        if (token) {
            const data = Tokens.getUser(token);
            if (data === undefined) {
                res.status(401).json({errors: ["Invalid or expired token."]});
            } else {
                res.json(data);
            }
        } else {
            res.status(400).json({errors: ["No 'Authorization' header provided."]});
        }
    }

    private static getUser(token: string): IPayload | undefined {
        try {
            return jsonWebToken.verify(token, Tokens.SECRET) as IPayload;
        } catch (e) {
            return undefined;
        }
    }

    private static createToken(user: User): string {
        return jsonWebToken.sign(
            {
                id: user.getId(),
                username: user.getUsername(),
            },
            Tokens.SECRET,
            {
                algorithm: Tokens.ALGORITHM,
                expiresIn: Tokens.EXPIRATION,
            },
        )
    }
}
