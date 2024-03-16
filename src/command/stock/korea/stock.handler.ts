import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { sendStockInfo } from 'src/lib/utils';
import { stockDetailInfo, stockLightInfo } from './data';


@Injectable()
export class korStockHandler {
    name = '?'
    regex = new RegExp(`^\\?`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            var msginput = msg.content.slice(1);

            const stocklight: any = await stockLightInfo(msginput);
            const stocknum = stocklight.num
            const stockdetail: any = await stockDetailInfo(stocknum);
            const rate = stockdetail.rate.substring(0, 1)

            const emoticon = rate === "+" ? "🔴" : rate === "-" ? "🔵" : "⚪"

            var output = "📌" + " [" + stocklight.name + "] " + "주식시세"
            output += "\n\n 현재주가 : " + stockdetail.price + " 원 (" + emoticon + " " + stockdetail.rate + ")"
            output += "\n\n 거래대금 : " + stockdetail.volume + " 백만원"
            output += "\n\n 시가총액 : " + stockdetail.size + " 억원\n\n"
            output += await sendStockInfo(
                "https://api.molya.kr/v1/image/create",
                stocklight.name,
                stockdetail.price,
                stockdetail.rate,
                stocklight.chart
            );

            await (stocklight.name === "" ? null : msg.replyText(output))
        }
        catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}