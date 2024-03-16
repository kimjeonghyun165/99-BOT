import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomSchema } from './schemas/room.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { UserSchema } from 'src/users/schemas/user.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }, { name: 'User', schema: UserSchema }]), UsersModule],
  exports: [RoomService],
  providers: [RoomService],
  controllers: [RoomController]
})
export class RoomModule { }
