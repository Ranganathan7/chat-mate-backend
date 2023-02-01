import  { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ValidateJwtMiddleware } from "src/middlewares/validateJwt.middleware";
import { ValidateLoginBodyMiddleware } from "src/middlewares/validateLoginBody.middleware";
import { ValidateSignupBodyMiddleware } from "src/middlewares/validateSignupBody.middleware";
import { User, UserSchema } from "src/schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema}
        ]),
        JwtModule.register({
            secret: "chat-mate-ranguDpro",
            signOptions: { expiresIn: "30d" }
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