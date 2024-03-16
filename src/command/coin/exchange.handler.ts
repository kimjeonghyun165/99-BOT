import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { krwtoUsd } from 'src/lib/utils';

const coinmarketcap = require("../../lib/others/coinmarketcap").tokenInfo;

@Injectable()
export class exchangeHandler {
    name = '!'
    regex = new RegExp(`^!`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            var cmd = msg.content.slice(1);

            if (cmd.startsWith("환전 ")) {
                const amount = cmd.split(" ")[1].replace(/,/g, "");
                const coin = cmd.split(" ")[2].toUpperCase();
                const cryptoCoin = await coinmarketcap(coin);
                var currency = await krwtoUsd();
                var _KRW: number = cryptoCoin.currentUsdPirce / currency;
                var result = Number(amount) * _KRW;
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }

            if (cmd.startsWith("역산 ")) {
                const krwamount = cmd.split(" ")[1].replace(/,/g, "");
                const coin = cmd.split(" ")[2].toUpperCase();
                const cryptoCoin = await coinmarketcap(coin);
                var currency = await krwtoUsd();
                var _KRW: number = cryptoCoin.currentUsdPirce / currency;
                var result = Number(krwamount) / _KRW;
                await msg.replyText("🪙 = " + result.toLocaleString("en") + " " + coin);
            }
        } catch (error) {
            Logger.error(error.message, error.stack)
            msg.replyText("티커명을 올바르게 입력해주세요.\n예시 : !환전 1000 btc");
        }
    };
}