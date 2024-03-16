import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from 'src/room/schemas/room.schemas';
import { coinNessHandler } from './coinness/coinness.handler';
import { Command2Service } from './command2.service';
import { fideLionDetailHandler } from './fidelion/detail.handler';
import { superWalkDetailHandler } from './superwalk/detail.handler';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }])],
  providers: [Command2Service, coinNessHandler, superWalkDetailHandler, fideLionDetailHandler]
})
export class Command2Module { }
