import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { krwtooUsd, krwtoUsd } from '../../../lib/utils';
import { walkInfo, grndInfo, frcInfo, trcInfo, fitInfo, awmInfo } from '../tokenInfo';

@Injectable()
export class m2eCoinInfoHandler {
    name = 'ㅇㅌㅇ'
    regex = new RegExp(`^ㅇㅌㅇ$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const currency = await krwtoUsd();
            const currency2 = await krwtooUsd();
            const walk = await walkInfo();
            const grnd = await grndInfo();
            const frc = await frcInfo();
            const trc = await trcInfo();
            const fit = await fitInfo();
            const awm = await awmInfo();

            const aRate =
                Number(awm.awmRate) > 0
                    ? "📈+" + awm.awmRate
                    : Number(awm.awmRate) < 0
                        ? "📉" + awm.awmRate
                        : "📊" + awm.awmRate;


            const ffRate =
                Number(fit.fitRate) > 0
                    ? "📈+" + Number(fit.fitRate)
                    : Number(fit.fitRate) < 0
                        ? "📉" + Number(fit.fitRate)
                        : "📊" + Number(fit.fitRate)

            const fRate =
                Number(frc.frcRate) > 0
                    ? "📈" + frc.frcRate
                    : Number(frc.frcRate) < 0
                        ? "📉" + frc.frcRate
                        : "📊" + frc.frcRate;

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

            const tRate =
                Number(trc.trcRate) > 0
                    ? "📈" + trc.trcRate
                    : Number(trc.trcRate) < 0
                        ? "📉" + trc.trcRate
                        : "📊" + trc.trcRate;

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
                "* FRC : " +
                fRate +
                "%\n ㄴ KRW : " +
                (frc.frcPrice / currency).toFixed(2) +
                " 원\n\n";

            output +=
                "* FIT : " +
                ffRate +
                "%\n ㄴ KRW : " +
                (fit.fitPrice / currency).toFixed(2) +
                " 원\n\n";

            output +=
                "* TRC : " +
                tRate +
                "%\n ㄴ KRW : " +
                (trc.trcPrice / currency).toFixed(2) +
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