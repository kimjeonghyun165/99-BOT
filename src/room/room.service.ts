// rooms.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/room.schemas';
import { UDPServer, Message } from '@remote-kakao/core';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schemas';
import * as dayjs from 'dayjs'

@Injectable()
export class RoomService {

    constructor(
        @InjectModel('Room') private readonly roomModel: Model<Room>,
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly users: UsersService // Initialize users service here
    ) { }


    async room(client: UDPServer) {
        client.on("message", async (message) => {
            try {
                const roomInfo = await this.roomFindOne(message.room.id);
                const userInfo = await this.userModel.findOne({ serialNum: message.sender.hash }).exec()

                if (roomInfo === null) {
                    await this.roomCreate(message);
                }

                if (userInfo === null) return;

                if (!roomInfo.users.includes(userInfo._id)) {
                    roomInfo.users.push(userInfo._id);
                    await roomInfo.save();
                }

                const name = message.sender.name !== roomInfo.name ? message.room.name : roomInfo.name
                const cnAlarm = message.content === "!코인니스온" ? true : message.content === "!코인니스오프" ? false : roomInfo.alarm.coinNess
                const swAlarm = message.content === "!슈퍼워크온" ? true : message.content === "!슈퍼워크오프" ? false : roomInfo.alarm.superWalk
                const roomAlarm = message.content === "!온" ? true : message.content === "!오프" ? false : roomInfo.alarm.roomInfo

                const newUserData: Partial<Room> = {
                    name: name,
                    alarm: {
                        coinNess: cnAlarm,
                        superWalk: swAlarm,
                        roomInfo: roomAlarm
                    },
                };
                await this.updateRoom(message.room.id, newUserData)

            } catch (error) {
                Logger.error(error.message, error.stack);
            }
        });
    }

    async roomCreate(message: Message): Promise<Room> {
        const date = dayjs().format("YYYY-MM-DD HH:mm:ss");
        try {
            const defaultRoom: Room = new this.roomModel({
                date: date,
                name: message.room.name,
                serialNum: message.room.id,
                users: [],
                alarm: {
                    roomInfo: false,
                    coinNess: false,
                    superWalk: false,
                },
                score: {
                    day: 0,
                    month: 0,
                    all: 0,
                },
                premium: false,
            });

            return await defaultRoom.save();
        } catch (error) {
            Logger.error(error.message, error.stack);
        }
    }

    async roomFindAll(): Promise<Room[]> {
        return this.roomModel.find().exec();
    }

    async roomFindOne(serialNum: string): Promise<Room | null> {
        try {
            const room = await this.roomModel.findOne({ serialNum }).exec();
            return room;
        } catch (error) {
            Logger.error(error.message, error.stack);
            return null;
        }
    }

    async updateRoom(serialNum: string, updatedFields: Partial<Room>) {
        try {
            const updateQuery = { $set: updatedFields };
            await this.roomModel.updateOne({ serialNum }, updateQuery);
        } catch (error) {
            Logger.error('Error updating user:', error);
        }
    }

}
