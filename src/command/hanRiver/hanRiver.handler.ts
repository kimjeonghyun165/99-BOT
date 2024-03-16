import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import axios from 'axios';

@Injectable()
export class hanRiverHandler {
    name = '!한강'
    regex = new RegExp(`^!한강$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const temperature = await axios.get("https://hangang.ivlis.kr/aapi.php?type=dgr")
            const wiseSay = await axios.get("https://hangang.ivlis.kr/aapi.php?type=text")
            const local = await axios.get("https://hangang.ivlis.kr/aapi.php?type=time")
            var output = "한강물 온도 : " + temperature.data + '\u200b'.repeat(500) + "\n----------------------\n\n명언 : "
            output += wiseSay.data + "\n\n" + local.data;
            await msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}