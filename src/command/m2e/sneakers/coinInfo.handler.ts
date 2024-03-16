import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { krwtoUsd } from '../../../lib/utils';
import { fitInfo, frcInfo, wemixInfo, } from '../tokenInfo';

@Injectable()
export class sneakersInfoHandler {
    name = 'ㅅㄴ'
    regex = new RegExp(`^ㅅㄴ$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const currency = await krwtoUsd();
            const frcRate = (await frcInfo()).frcRate;
            const frcPrice = (await frcInfo()).frcPrice;
            const fitRate = (await fitInfo()).fitRate;
            const fitPrice = (await fitInfo()).fitPrice;
            const wemixRate = (await wemixInfo()).wemixRate;
            const wemixPrice = (await wemixInfo()).wemixPrice;

            const fRate = Number(frcRate) > 0 ? "📈" + frcRate : Number(frcRate) < 0 ? "📉" + frcRate : "📊" + frcRate;
            const fRate2 = Number(fitRate) > 0 ? "📈" + fitRate : Number(fitRate) < 0 ? "📉" + fitRate : "📊" + fitRate;
            const wRate = Number(wemixRate) > 0 ? "📈" + wemixRate : Number(wemixRate) < 0 ? "📉" + wemixRate : "📊" + wemixRate;

            var output = "[SNKRZ Info]\n";
            output += "━━━━━━━━━━━━━━\n";
            output +=
                "* FRC : " + fRate +
                "%\n ㄴ KRW : " +
                (frcPrice / currency).toFixed(2) +
                " 원\n ㄴ USD : " +
                Number(frcPrice).toFixed(2) +
                " $\n\n";
            output +=
                "* FIT : " + fRate2 +
                "%\n ㄴ KRW : " +
                (fitPrice / currency).toFixed(2) +
                " 원\n ㄴ USD : " +
                Number(fitPrice).toFixed(2) +
                " $\n\n";
            output +=
                "* WEMIX : " + wRate +
                "%\n ㄴ KRW : " +
                (wemixPrice / currency).toFixed(2) +
                " 원\n ㄴ USD : " +
                wemixPrice.toFixed(2) +
                " $";

            await msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}