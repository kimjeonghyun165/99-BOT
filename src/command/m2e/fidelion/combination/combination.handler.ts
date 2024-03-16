import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { toothpasteInfo, usdtInfo } from '../../tokenInfo';
import { basic1, basic2, common, luxury1, luxury2, luxury3, max, middle1, middle2, premium } from './data';

@Injectable()
export class fidelCombinationHandler {
    name = '$조합 ';
    regex = new RegExp(`^\\$조합$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const currency = (await usdtInfo()).usdtPrice;
            const toothpastePrice = (await toothpasteInfo()).toothpastePrice;
            const toothpasteKrwPrice = toothpastePrice * currency;

            var output = "조합표입니다." + '\u200b'.repeat(500)
            output += '\n━━━━━━━━━━━━━━\n';
            output +=
                '#베이직-1\n' +
                '*(46-0-0 / 치약 : ' + basic1.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((basic1 * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(basic1 * toothpastePrice).toLocaleString('en')} $\n\n`;
            output +=
                '#베이직-2\n' +
                '*(46-0-38 / 치약 : ' + basic2.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((basic2 * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(basic2 * toothpastePrice).toLocaleString('en')} $\n\n`;
            output +=
                '#국룰\n' +
                '*(46-46-38 / 치약 : ' + common.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((common * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(common * toothpastePrice).toLocaleString('en')} $\n\n`;
            output +=
                '#미들-1\n' +
                '*(46-46-60 / 치약 : ' + middle1.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((middle1 * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(middle1 * toothpastePrice).toLocaleString('en')} $\n\n`;
            output +=
                '#미들-2\n' +
                '*(46-61-60 / 치약 : ' + middle2.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((middle2 * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(middle2 * toothpastePrice).toLocaleString('en')} $\n\n`;
            output +=
                '#프리미엄\n' +
                '*(46-76-60 / 치약 : ' + premium.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((premium * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(premium * toothpastePrice).toLocaleString('en')} $\n\n`;
            output +=
                '#럭셔리-1\n' +
                '*(90-76-60 / 치약 : ' + luxury1.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((luxury1 * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(luxury1 * toothpastePrice).toLocaleString('en')} $\n\n`;
            output +=
                '#럭셔리-2\n' +
                '*(90-76-60 / 치약 : ' + luxury2.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((luxury2 * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(luxury2 * toothpastePrice).toLocaleString('en')} $\n\n`;
            output +=
                '#럭셔리-3\n' +
                '*(90-76-60 / 치약 : ' + luxury3.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((luxury3 * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(luxury3 * toothpastePrice).toLocaleString('en')} $\n\n`;
            output +=
                '#마스터(만랩)\n' +
                '*(90-90-90 / 치약 : ' + max.toLocaleString('en') + ' 개)\n' +
                ` ㄴ KRW : ${Number((max * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                ` ㄴ USD : ${(max * toothpastePrice).toLocaleString('en')} $`;

            msg.replyText(output);
        } catch (error) {
            msg.replyText('명령어가 잘못되었습니다.');
            Logger.error(error.message, error.stack);
        }
    }
}
