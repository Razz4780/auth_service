import {RequestHandler} from "express";
import {validate} from "jsonschema";

export class ValidationMiddleware {
    private readonly schema: object;

    constructor(schema: object) {
        this.schema = schema;
    }

    public getMiddleware(): RequestHandler {
        return (req, res, next) => {
            const validationResult = validate(req.body, this.schema);
            if (validationResult.valid) {
                next();
            } else {
                const errors = validationResult.errors.map(err => err.toString());
                res.status(400).json({errors: errors});
            }
        }
    }
}
