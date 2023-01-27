import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { config } from './config/config';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      load: [config] 
    }),
    MongooseModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          uri: config.get<string>('dbURL')
        }),
        inject: [ConfigService]
      }
    ),
    UserModule,
    ChatModule,
    ConversationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
