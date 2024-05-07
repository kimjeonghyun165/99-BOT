import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { ahoyInfo, usdtInfo } from '../tokenInfo';

@Injectable()
export class ahoyCoinInfoHandler {
    name = 'ㅇㅎㅇ'
    regex = new RegExp(`^ㅇㅎㅇ$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const currency = (await usdtInfo()).usdtPrice;
            const ahoy = await ahoyInfo();

            const ahoyRate =
                Number(ahoy.ahoyRate) > 0
                    ? "📈+" + ahoy.ahoyRate
                    : Number(ahoy.ahoyRate) < 0
                        ? "📉" + ahoy.ahoyRate
                        : "📊" + ahoy.ahoyRate;

            var output = "[Ahoy Info]\n";
            output += "━━━━━━━━━━━━━━\n";
            output +=
                "* cac : " +
                ahoyRate + " %" +
                "\n ㄴ KRW : " +
                (ahoy.ahoyPrice * currency).toFixed(2) +
                " 원\n ㄴ USD : " +
                (ahoy.ahoyPrice).toFixed(5) +
                " $";

            await msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}