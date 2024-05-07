import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import axios from 'axios';

@Injectable()
export class longShortHandler {
    name = '!롱숏';
    regex = new RegExp(`^!롱숏$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const url = "https://api.coinness.com/market/v1/future/longshort?code=BTC&period=24h";
            const html = await axios.get(url);
            const data = html.data.exchanges;

            let output = "[거래소 롱숏 비율]" + "\u200b".repeat(500) + "\n━━━━━━━━━━━━━━\n";

            for (let i = 0; i < data.length && i < 13; i++) {
                output += `* ${data[i].nameKo} : 롱 ${data[i].longRate} 숏 ${data[i].shortRate}\n\n`;
            }

            await msg.replyText(output);
        }
        catch (error) {
            Logger.error(error.message, error.stack);
        }
    }
}
