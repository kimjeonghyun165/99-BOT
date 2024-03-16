import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '@remote-kakao/core';
import { Model } from 'mongoose';
import { nftInfo } from 'src/lib/utils';
import { Opensea } from './opensea.schemas';

@Injectable()
export class nftListHandler {
    constructor(
        @InjectModel('Opensea') private readonly openseaModel: Model<Opensea>,
    ) { }

    name = '!n목록'
    regex = new RegExp(`^!n목록$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const existingData = await this.openseaModel.find()

            existingData.sort((a, b) => a.link.localeCompare(b.link));

            var output = 'NFT 줄임말 목록입니다.\n' + `\u200b`.repeat(500) + '\n';
            existingData.forEach((project, index) => {
                const { name, link } = project;
                output += `${index + 1}. ${link} : ${name}\n`;
            });
            await msg.replyText(output)

        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}