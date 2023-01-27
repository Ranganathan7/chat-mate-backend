import { HttpException } from "@nestjs/common";


export class UserAlreadyExistsException extends HttpException {
    constructor(message: string) {
        super(message, 409)
    }
}