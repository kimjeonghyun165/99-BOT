import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '@remote-kakao/core';
import { Model } from 'mongoose';
import { magicEdenInfo, openseaInfo } from 'src/lib/utils';
import { Opensea } from './nft.schemas';

@Injectable()
export class nftRegisterHandler {
    constructor(
        @InjectModel('Opensea') private readonly openseaModel: Model<Opensea>,
    ) { }

    name = '!n등록'
    regex = new RegExp(`^!n등록`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const cmd = msg.content.slice(5).split("/")
            const projectName = cmd[0];
            const projectLink = cmd[1];

            const existingLink = await this.openseaModel.findOne({ link: projectLink });
            const existingName = await this.openseaModel.findOne({ name: projectName });

            if (existingName) {
                msg.replyText("다른 줄임말을 등록해주시길 바랍니다.")
                return;
            }

            if (existingLink) {
                existingLink.name.push(projectName);
                await existingLink.save();
            } else {
                // link가 존재하지 않는 경우 새로운 데이터 생성
                await this.openseaModel.create({
                    name: [projectName],
                    link: projectLink,
                });
            }
            await msg.replyText("줄임말이 등록되었습니다.\n줄임말 : " + projectName + "\n프로젝트 : " + projectLink)
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}