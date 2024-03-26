import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, UDPServer } from '@remote-kakao/core';
import { Model } from 'mongoose';
import { processArrayWithDelay } from 'src/lib/utils';
import { Room } from 'src/room/schemas/room.schemas';

@Injectable()
export class marketingHandler {
    constructor(
        @InjectModel('Room') private readonly roomModel: Model<Room>,
    ) { }
    name = '!광고'
    regex = new RegExp(`^!광고`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message, client: UDPServer, address: any): Promise<void> {
        try {
            const cmd = msg.content.slice(3);
            if (cmd.startsWith('테스트 ')) {
                const msginput = cmd.slice(4).split("|")[0];
                const msginput2 = cmd.split("|")[1];

                var output = "🕊️ 구구 정보통 🕊️\n\n"
                output += msginput + "\u200b".repeat(500) + "\n\n"
                output += msginput2
                output += "\n\n━━━━━━━━━━━━━━\n"
                output += "About GooGoo Bot : https://planet-99.com"
                await msg.replyText(output)
            }
            if (cmd.startsWith('3839 ')) {
                const msginput = cmd.slice(5).split("|")[0];
                const msginput2 = cmd.split("|")[1];

                const rooms = await this.roomModel.find();
                const serailNum = await rooms
                    .filter(room => room.serialNum !== "18392000720314681")
                    .map(room => room.serialNum);

                var output = "🕊️ 구구 정보통 🕊️\n\n"
                output += msginput + "\u200b".repeat(500) + "\n\n"
                output += msginput2
                output += "\n\n━━━━━━━━━━━━━━\n"
                output += "About GooGoo Bot : https://planet-99.com"
                await processArrayWithDelay(serailNum, 5, 1000, client, output, address)
            }
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}