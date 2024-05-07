import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UDPServer } from '@remote-kakao/core';
import { Model } from 'mongoose';
import { findMany, processArrayWithDelay } from 'src/lib/utils';
import { Room } from 'src/room/schemas/room.schemas';
import axios from 'axios';
import { ICommandHandler } from '../ICommandHandler';

let newsId: any;

@Injectable()
export class coinNessHandler implements ICommandHandler {

    constructor(
        @InjectModel('Room') private readonly roomModel: Model<Room>,
    ) { }

    async execute(client: UDPServer, address: any): Promise<void> {
        try {
            const news = await axios.get("https://api.coinness.com/feed/v1/news?limit=5");
            const newsData = news.data;
            const title = newsData[0].title;
            const content = newsData[0].content;
            const output = title + "\u200b".repeat(500) + "\n\n" + content + '\n\n출처-코인니스'
            if (newsId !== newsData[0].id) {
                const roomName = await findMany(this.roomModel, { 'alarm.coinNess': true })
                newsId = newsData[0].id;

                const serailNum = await roomName.map(room => room.serialNum);

                await processArrayWithDelay(serailNum, 5, 1000, client, output, address)
            } else return;
        }
        catch (error) {
            Logger.error(error.message, error.stack)
        }
    }
}