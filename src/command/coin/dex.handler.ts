import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
const dexscreener = require("../../lib/others/dexscreener").tokenInfo;

@Injectable()
export class dexHandler {
    name = '덱 '
    regex = new RegExp(`^덱 `);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            var coin = msg.content.slice(2);
            const coinInfo = await dexscreener(coin)
            let mint = coinInfo.mintable === 1 ? "✅ NO MINT" : coinInfo.mintable === 0 ? "❗NO MINT" : "❓Unknown";
            let freeze = coinInfo.freeze === 1 ? "✅ NO FREEZE" : coinInfo.freeze === 0 ? "❗NO FREEZE" : "❓Unknown";

            let output = "[" + coinInfo.name + "/" + coinInfo.symbol + "]"
            output += "\n\n⛓️Dex : " + coinInfo.chainId + " @ " + coinInfo.dexId
            output += "\n⏰Age : " + coinInfo.age
            output += "\n💲Usd : " + coinInfo.currentUsdPrice.toLocaleString('en') + "$"
            output += "\n📈24h : " + coinInfo.changeRate.toLocaleString('en') + "%"
            output += "\n💧Liq : " + coinInfo.liq.toLocaleString('en') + "$"
            output += "\n📊Vol : " + coinInfo.vol.toLocaleString('en') + "$"
            output += "\n💰️Fdv : " + coinInfo.fullySupply.toLocaleString('en') + "$"
            output += "\n🤔Opt : " + mint + " | " + freeze
            output += "\n🔥Burn : " + coinInfo.burn * 100 + " %"

            output += "\n\n" + coinInfo.url

            msg.replyText(output)
        }
        catch (e) {
            Logger.error(e)
            msg.replyText(await dexscreener(coin));
        }
    };
}