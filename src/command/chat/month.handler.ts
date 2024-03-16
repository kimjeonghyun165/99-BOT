import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '@remote-kakao/core';
import { Model } from 'mongoose';
import { Room } from 'src/room/schemas/room.schemas';
import { User } from 'src/users/schemas/user.schemas';
import { ICommandHandler } from '../ICommandHandler';

@Injectable()
export class monthchatHandler implements ICommandHandler {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Room') private readonly roomModel: Model<Room>,
    ) { }
    name = '!월챗'
    regex = new RegExp(`^!월챗$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const room = await this.roomModel.findOne({ serialNum: msg.room.id }).exec();
            if (!room) return;
            const userIds = room.users;
            const users = await this.userModel
                .find({ _id: { $in: userIds } })
                .sort({ 'count.month': -1 })
                .exec();

            var output = '월 채팅 순위입니다.\n' + `\u200b`.repeat(500) + '\n';
            users.forEach((user, index) => {
                const { name, count: { month } } = user;
                output += month === 0 ? "" : `${index + 1}. ${name[0]} : ${month}회\n`;
            });
            await msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}