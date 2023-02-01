import  { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { jwtConstants } from "../config/constants";
import { ValidateJwtMiddleware } from "../middlewares/validateJwt.middleware";
import { ValidateLoginBodyMiddleware } from "../middlewares/validateLoginBody.middleware";
import { ValidateSignupBodyMiddleware } from "../middlewares/validateSignupBody.middleware";
import { User, UserSchema } from "../schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema}
        ]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresIn }
        })
    ],
    controllers: [UserController],
    providers: [UserService]
})

export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidateSignupBodyMiddleware)
            .forRoutes({path: 'chat-mate-api/signup', method: RequestMethod.POST})
        consumer
            .apply(ValidateLoginBodyMiddleware)
            .forRoutes({path: 'chat-mate-api/login', method: RequestMethod.POST})
        consumer
            .apply(ValidateJwtMiddleware)
            .forRoutes({path: 'chat-mate-api/edit-profile', method: RequestMethod.ALL})
        consumer
            .apply(ValidateJwtMiddleware)
            .forRoutes({path: 'chat-mate-api/search-user', method: RequestMethod.ALL})
    }
}