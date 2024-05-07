import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { dedInfo, solInfo, toothpasteInfo, usdtInfo } from '../tokenInfo';

@Injectable()
export class fidelionCoinInfoHandler {
    name = 'ㅍㄷ'
    regex = new RegExp(`^ㅍㄷ$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const currency = (await usdtInfo()).usdtPrice;
            const toothpaste = await toothpasteInfo();
            const ded = await dedInfo();
            const sol = await solInfo();

            const tpRate =
                Number(toothpaste.toothpasteRate) > 0
                    ? "📈+" + toothpaste.toothpasteRate
                    : Number(toothpaste.toothpasteRate) < 0
                        ? "📉" + toothpaste.toothpasteRate
                        : "📊" + toothpaste.toothpasteRate;

            const dedRate =
                Number(ded.dedRate) > 0
                    ? "📈+" + ded.dedRate
                    : Number(ded.dedRate) < 0
                        ? "📉" + ded.dedRate
                        : "📊" + ded.dedRate;


            const sRate =
                Number(sol.solRate) > 0
                    ? "📈+" + sol.solRate
                    : Number(sol.solRate) < 0
                        ? "📉" + sol.solRate
                        : "📊" + sol.solRate;

            var output = "[Fidelion Info]\n";
            output += "━━━━━━━━━━━━━━\n";
            output +=
                "* 2080 : " +
                tpRate + " %" +
                "\n ㄴ KRW : " +
                (toothpaste.toothpastePrice * currency).toFixed(2) +
                " 원\n ㄴ USD : " +
                (toothpaste.toothpastePrice).toFixed(5) +
                " $\n\n";
            output +=
                "* SOL : " +
                sRate + " %" +
                "\n ㄴ KRW : " +
                Number((sol.solPrice).toFixed(0)).toLocaleString('en') +
                " 원\n ㄴ USD : " +
                (sol.solPrice / currency).toFixed(2) +
                " $\n\n";
            output +=
                "* DED : " +
                dedRate + " %" +
                "\n ㄴ KRW : " +
                (ded.dedPrice * currency).toFixed(2) +
                "\n ㄴ USD : " +
                (ded.dedPrice).toFixed(3) +
                " $";

            await msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}