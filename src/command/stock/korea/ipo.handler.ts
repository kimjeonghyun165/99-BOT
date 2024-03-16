import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { formatDateString } from 'src/lib/utils';
import { demandIpoInfo, ipoInfo } from './data';


@Injectable()
export class korIpoHandler {
    name = '!공모주'
    regex = new RegExp(`^!공모주$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const cplIpo = await ipoInfo();
            const rdyIpo = await demandIpoInfo();
            const offer = cplIpo.tobeOffer
            const forecast = rdyIpo.tobeForecast
            const list = cplIpo.tobeListed;

            var output = "공모주 일정입니다." + "\u200b".repeat(500) + "\n\n"
            output += "------ 청약 예정 ------\n\n";
            await Promise.all(offer.map(async (stock) => {
                const startDate = await formatDateString(stock.poStartDate, "yyyyMMdd", 'yy.MM.dd');
                const endDate = await formatDateString(stock.poEndDate, "yyyyMMdd", 'yy.MM.dd');
                output += "종목명 : " + stock.itemName;
                output += "\n공모가 : " + stock.poPrice + " 원";
                output += "\n청약일정 : " + startDate + " ~ " + endDate;
                output += "\n증권사 : " + stock.leadManager + "\n\n";
            }));

            output += "------ 수요 예측 ------\n\n";
            await Promise.all(forecast.map(async (stock) => {
                const startDate = await formatDateString(stock.poStartDate, "yyyyMMdd", 'yy.MM.dd');
                const endDate = await formatDateString(stock.poEndDate, "yyyyMMdd", 'yy.MM.dd');
                output += "종목명 : " + stock.itemName;
                output += "\n예상공모가 : " + stock.expectedPoStart + " ~ " + stock.expectedPoEnd + " 원";
                output += "\n청약일정 : " + startDate + " ~ " + endDate;
                output += "\n증권사 : " + stock.leadManager + "\n\n";
            }));

            output += "------ 상장 예정 ------\n\n";
            await Promise.all(list.map(async (stock) => {
                const listingDate = await formatDateString(stock.listedDueDate, "yyyyMMdd", 'yy.MM.dd');
                output += "종목명 : " + stock.itemName;
                output += "\n공모가 : " + stock.poPrice + " 원";
                output += "\n상장일 : " + listingDate + "\n\n";
            }));

            await msg.replyText(output)

        }
        catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}