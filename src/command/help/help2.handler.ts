import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { help_msg2 } from './helpData';

@Injectable()
export class help2Handler {
    name = '!엠투이명령어'
    regex = new RegExp(`^!엠투이명령어$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const output: string = "(⊙_⊙)？엠투이 명령어 모음집\nhttps://planet-99.com " + "\u200b".repeat(500) + "\n\n" + help_msg2.join("\n")
            msg.replyText(output)
        }
        catch (error) {
            Logger.error(error.message, error.stack)
        }

    };
}