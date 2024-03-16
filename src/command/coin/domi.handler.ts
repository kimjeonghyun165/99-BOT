import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import axios from 'axios';

const API_KEY = "0a4d17dd-019b-4e97-8ecf-d1481ccd83ca";

@Injectable()
export class domiHandler {
    name = '!도미'
    regex = new RegExp(`^!도미$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const cryptoMarket =
                "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?CMC_PRO_API_KEY=" +
                API_KEY;

            const html = await axios.get(cryptoMarket);

            var btcDomi = html.data.data.btc_dominance.toFixed(2);
            var ethDomi = html.data.data.eth_dominance.toFixed(2);
            var total_market_cap =
                html.data.data.quote.USD.total_market_cap.toFixed(0);
            var total_volume_24h =
                html.data.data.quote.USD.total_volume_24h.toFixed(0);
            var altcoin_market_cap =
                html.data.data.quote.USD.altcoin_market_cap.toFixed(0);
            var altcoin_volume_24h =
                html.data.data.quote.USD.altcoin_volume_24h.toFixed(0);

            var output = "[도미넌스]\n━━━━━━━━━━━━━━\n";
            output += "* BTC 도미넌스 : " + btcDomi + "%\n";
            output += "* ETH 도미넌스 : " + ethDomi + "%\n\n";
            output += "[시가총액]\n━━━━━━━━━━━━━━\n";
            output += "* 총 시가총액 : " + Number(total_market_cap).toLocaleString('ko-KR') + " $\n";
            output += "* 총 거래량 : " + Number(total_volume_24h).toLocaleString('ko-KR') + " $\n\n";
            output += "* 알트 시가총액 : " + Number(altcoin_market_cap).toLocaleString('ko-KR') + " $\n";
            output += "* 알트 거래량 : " + Number(altcoin_volume_24h).toLocaleString('ko-KR') + " $";

            await msg.replyText(output);
        }
        catch (error) {
            Logger.error((error.message, error.stack))
        }

    }
}