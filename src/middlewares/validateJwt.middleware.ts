import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'src/config/constants';

export class ValidateJwtMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies['chat-mate-jwt']
    if(!cookie) throw new UnauthorizedException("Request is missing api-token, Please login again to continue!")
    const data = jwt.verify(cookie, jwtConstants.secret)
    if(!data) throw new UnauthorizedException("Invalid api-token in request, Please login again to continue!")
    req.headers['id'] = data['id']
    next();
  }
}
