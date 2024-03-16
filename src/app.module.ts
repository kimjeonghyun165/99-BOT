import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';
import { CommandModule } from './command/command.module';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { Command2Module } from './command2/command2.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_API_TOKEN),
    RoomModule,
    CommandModule,
    LoginModule,
    UsersModule,
    Command2Module,
  ],
})
export class AppModule { }
