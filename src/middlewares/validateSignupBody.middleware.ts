import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class ValidateSignupBodyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if(!req.body['name'] || typeof(req.body['name']) !== 'string')
            this.missingField('name', 'string')
        if(!req.body['email'] || typeof(req.body['email']) !== 'string')
            this.missingField('email', 'string')
        if(!req.body['password'] || typeof(req.body['password']) !== 'string')
            this.missingField('password', 'string')
        if(!req.body['pic'] || typeof(req.body['pic']) !== 'string')
            this.missingField('pic', 'string')

        next();
    }

    private missingField(field: string, type: string): void {
        throw new BadRequestException("Missing required field: " + field + " [or] It must be a of type: " + type)
    }
}
