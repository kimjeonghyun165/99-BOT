import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schemas';
import { UsersService } from './users.service';

@Module({
    exports: [UsersService],
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    providers: [UsersService],
    controllers: []
})
export class UsersModule { }
