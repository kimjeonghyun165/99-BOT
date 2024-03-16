import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import axios from 'axios';

@Injectable()
export class coinnessAlarmHandler {
    name = '!코인니스'
    regex = new RegExp(`^!코인니스`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const cmd = msg.content.slice(5);
            if (cmd === '온')
                await msg.replyText("코인니스 알람이 켜졌습니다.");
            if (cmd === '오프')
                await msg.replyText("코인니스 알람이 꺼졌습니다.");
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}