import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { help_msg } from './helpData';

@Injectable()
export class helpHandler {
    name = '!명령어'
    regex = new RegExp(`^!명령어$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const output: string = "(⊙_⊙)？봇 사용법\nhttps://planet-99.com " + "\u200b".repeat(500) + "\n\n" + help_msg.join("\n")
            msg.replyText(output)
        }
        catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}