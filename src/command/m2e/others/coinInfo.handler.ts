import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { krwtoUsd } from 'src/lib/utils';
import { walkInfo, grndInfo, awmInfo, gstInfo, gmtInfo, usdtInfo } from '../tokenInfo';

@Injectable()
export class m2eCoinInfoHandler {
    name = 'ㅇㅌㅇ'
    regex = new RegExp(`^ㅇㅌㅇ$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const currency = (await usdtInfo()).usdtPrice;
            const currency2 = await krwtoUsd();
            const walk = await walkInfo();
            const grnd = await grndInfo();
            const gmt = await gmtInfo();
            const gst = await gstInfo();
            const awm = await awmInfo();

            const aRate =
                Number(awm.awmRate) > 0
                    ? "📈+" + awm.awmRate
                    : Number(awm.awmRate) < 0
                        ? "📉" + awm.awmRate
                        : "📊" + awm.awmRate;


            const ffRate =
                Number(gmt.gmtRate) > 0
                    ? "📈+" + Number(gmt.gmtRate)
                    : Number(gmt.gmtRate) < 0
                        ? "📉" + Number(gmt.gmtRate)
                        : "📊" + Number(gmt.gmtRate)

            const fRate =
                Number(gst.gstRate) > 0
                    ? "📈" + gst.gstRate
                    : Number(gst.gstRate) < 0
                        ? "📉" + gst.gstRate
                        : "📊" + gst.gstRate;

            const wRate =
                Number(walk.walkRate) > 0
                    ? "📈+" + walk.walkRate
                    : Number(walk.walkRate) < 0
                        ? "📉" + walk.walkRate
                        : "📊" + walk.walkRate;

            const gRate =
                Number(grnd.grndRate) > 0
                    ? "📈+" + grnd.grndRate
                    : Number(grnd.grndRate) < 0
                        ? "📉" + grnd.grndRate
                        : "📊" + grnd.grndRate;

            var output = "[M2E Info]\n";
            output += "━━━━━━━━━━━━━━\n";
            output +=
                "* WALK : " +
                wRate +
                "%\n ㄴ KRW : " +
                (walk.walkPrice[0] / currency2).toFixed(2) +
                " 원\n\n";
            output +=
                "* GRND : " +
                gRate +
                "%\n ㄴ KRW : " +
                (grnd.grndPrice[0] / currency2).toFixed(2) +
                " 원\n\n";
            output +=
                "* GST : " +
                fRate +
                "%\n ㄴ KRW : " +
                (gst.gstPrice * currency).toFixed(2) +
                " 원\n\n";

            output +=
                "* GMT : " +
                ffRate +
                "%\n ㄴ KRW : " +
                (gmt.gmtPrice * currency).toFixed(2) +
                " 원\n\n";

            output +=
                "* AWM : " +
                aRate +
                "%\n ㄴ KRW : " +
                (awm.awmPrice / currency2).toFixed(2) +
                " 원";

            await msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}