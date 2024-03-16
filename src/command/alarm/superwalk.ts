import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';

@Injectable()
export class superwalkAlarmHandler {
    name = '!슈퍼워크'
    regex = new RegExp(`^!슈퍼워크`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const cmd = msg.content.slice(5);
            if (cmd === '온')
                await msg.replyText("슈퍼워크 알람이 켜졌습니다.");
            if (cmd === '오프')
                await msg.replyText("슈퍼워크 알람이 꺼졌습니다.");
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}