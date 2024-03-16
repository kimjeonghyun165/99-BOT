import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '@remote-kakao/core';
import { Model } from 'mongoose';
import { Room } from 'src/room/schemas/room.schemas';
import { User } from 'src/users/schemas/user.schemas';
import { ICommandHandler } from '../ICommandHandler';

@Injectable()
export class dayRoomRankHandler implements ICommandHandler {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Room') private readonly roomModel: Model<Room>,
    ) { }
    name = '!일톡방랭킹'
    regex = new RegExp(`^!일톡방랭킹`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const room = await this.roomModel.find().exec();
            let roomScores = [];

            for (const [index, currentRoom] of room.entries()) {
                let score = 0;
                const userIds = currentRoom.users;
                const users = await this.userModel
                    .find({ _id: { $in: userIds } })
                    .exec();

                const filteredUsers = users.filter((user) => user.count.day > 0);

                score += filteredUsers.length * 5;
                filteredUsers.forEach((user) => {
                    score += user.count.day;
                });

                roomScores.push({ name: currentRoom.name, score }); // 각 방의 점수와 이름을 배열에 추가
            }

            roomScores.sort((a, b) => b.score - a.score);
            var output = '상위 10개 톡방 활성화 순위입니다.\n' + `\u200b`.repeat(500) + '\n';
            output += '구구 총 톡방 개수 : ' + Object.keys(room).length + '\n\n'
            for (let i = 0; i < Math.min(10, roomScores.length); i++) {
                const { name, score } = roomScores[i];
                output += `${i + 1}. ${name} : ${score}점\n\n`;
            }

            await msg.replyText(output);

        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}