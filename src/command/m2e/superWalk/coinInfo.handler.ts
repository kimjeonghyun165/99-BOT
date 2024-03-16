import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { krwtooUsd } from 'src/lib/utils';
import { walkInfo, grndInfo, klayInfo } from '../tokenInfo';

@Injectable()
export class superWalkCoinInfoHandler {
    name = 'ㅅㅇ'
    regex = new RegExp(`^ㅅㅇ$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const currency = await krwtooUsd();
            const walk = await walkInfo();
            const grnd = await grndInfo();
            const klay = await klayInfo();

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

            const kRate =
                Number(klay.klayRate) > 0
                    ? "📈+" + klay.klayRate
                    : Number(klay.klayRate) < 0
                        ? "📉" + klay.klayRate
                        : "📊" + klay.klayRate;

            var output = "[SuperWalk Info]\n";
            output += "━━━━━━━━━━━━━━\n";
            output +=
                "* WALK : " +
                wRate +
                " %\n ㄴ 스캐너 : " +
                (walk.walkPrice[0] / currency).toFixed(2) +
                " 원\n\n";
            output +=
                "* GRND : " +
                gRate +
                " %\n ㄴ 스캐너 : " +
                (grnd.grndPrice[0] / currency).toFixed(2) +
                " 원\n\n";
            output +=
                "* KLAY : " +
                kRate +
                " %\n ㄴ 스캐너 : " +
                (klay.klayPrice[0] / currency).toFixed(2) +
                " 원";

            await msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}