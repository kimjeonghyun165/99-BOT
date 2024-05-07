import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { krwtooUsd } from 'src/lib/utils';
import axios from 'axios';

const baseUrl = "https://api.upbit.com/v1/ticker?markets=";
const binanceUrl = "https://api.binance.com/api/v3/ticker/price?symbol=";

@Injectable()
export class gimpHandler {
    name = '!김프'
    regex = new RegExp(`^!김프$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {

        try {
            const upbitBtc = await axios.get(baseUrl + "KRW-BTC");
            const upbitEth = await axios.get(baseUrl + "KRW-ETH");
            const upbitXrp = await axios.get(baseUrl + "KRW-XRP");
            const upbitSol = await axios.get(baseUrl + "KRW-SOL");

            const binanceBtc = await axios.get(binanceUrl + "BTCUSDT");
            const binanceEth = await axios.get(binanceUrl + "ETHUSDT");
            const binanceXrp = await axios.get(binanceUrl + "XRPUSDT");
            const binanceSol = await axios.get(binanceUrl + "SOLUSDT");

            var currency: number = await krwtooUsd();

            const upbitBtcPrice: number = upbitBtc.data[0].trade_price;
            const upbitEthPrice: number = upbitEth.data[0].trade_price;
            const upbitXrpPrice: number = upbitXrp.data[0].trade_price;
            const upbitSolPrice: number = upbitSol.data[0].trade_price;

            const binanceBtcPrice: number = Math.round(binanceBtc.data.price / currency);
            const binanceEthPrice: number = Math.round(binanceEth.data.price / currency);
            const binanceXrpPrice: number = Math.round(binanceXrp.data.price / currency);
            const binanceSolPrice: number = Math.round(binanceSol.data.price / currency);


            const btcPremium =
                Math.round(((upbitBtcPrice / binanceBtcPrice) - 1) * 10000) / 100;
            const ethPremium =
                Math.round(((upbitEthPrice / binanceEthPrice) - 1) * 10000) / 100;
            const xrpPremium =
                Math.round(((upbitXrpPrice / binanceXrpPrice) - 1) * 10000) / 100;
            const solPremium =
                Math.round(((upbitSolPrice / binanceSolPrice) - 1) * 10000) / 100;

            const btcPremiumStr: string | number = btcPremium > 0 ? "+" + btcPremium : btcPremium;
            const ethPremiumStr: string | number = ethPremium > 0 ? "+" + ethPremium : ethPremium;
            const xrpPremiumStr: string | number = xrpPremium > 0 ? "+" + xrpPremium : xrpPremium;
            const solPremiumStr: string | number = solPremium > 0 ? "+" + solPremium : solPremium;

            let output = "[김치프리미엄]\n━━━━━━━━━━━━━━\n";
            output += "* BTC : " + btcPremiumStr + "%\n";
            output += " ㄴ 업비트 " + upbitBtcPrice.toLocaleString('ko-KR') + " 원\n";
            output += " ㄴ 바이낸스 " + binanceBtcPrice.toLocaleString('ko-KR') + " 원\n\n";
            output += "* ETH : " + ethPremiumStr + "%\n";
            output += " ㄴ 업비트 : " + upbitEthPrice.toLocaleString('ko-KR') + " 원\n";
            output += " ㄴ 바이낸스 : " + binanceEthPrice.toLocaleString('ko-KR') + " 원\n\n";
            output += "* XRP : " + xrpPremiumStr + "%\n";
            output += " ㄴ 업비트 : " + upbitXrpPrice.toLocaleString('ko-KR') + " 원\n";
            output += " ㄴ 바이낸스 : " + binanceXrpPrice.toLocaleString('ko-KR') + " 원\n\n";
            output += "* SOL : " + solPremiumStr + "%\n";
            output += " ㄴ 업비트 : " + upbitSolPrice.toLocaleString('ko-KR') + " 원\n";
            output += " ㄴ 바이낸스 : " + binanceSolPrice.toLocaleString('ko-KR') + " 원";

            await msg.replyText(output);
        }
        catch (error) {
            Logger.error(error.message, error.stack)
        }

    };
}