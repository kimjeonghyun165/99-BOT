import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';

@Injectable()
export class superwalkVolumeHandler {
    name = '!거래량'
    regex = new RegExp(`^!거래량$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            var output = "거래량 : https://superwalk-nft-dashboard.vercel.app/"
            await msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}