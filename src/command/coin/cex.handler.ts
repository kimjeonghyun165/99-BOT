import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';

const upbit = require("../../lib/cex/upbit").tokenInfo;
const bithumb = require("../../lib/cex/bithumb").tokenInfo
const coinone = require("../../lib/cex/coinone").tokenInfo
const binance = require("../../lib/cex/binance").tokenInfo;
const mexc = require("../../lib/cex/mexc").tokenInfo;
const bybit = require("../../lib/cex/bybit").tokenInfo;
const okx = require("../../lib/cex/okx").tokenInfo;
const coinmarketcap = require("../../lib/others/coinmarketcap").tokenInfo;


@Injectable()
export class cexHandler {
    name = '.'
    regex = new RegExp(`^\\.`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            var coin = msg.content.slice(1);
            coin = coin.toUpperCase();
            if (coin.split("")[0] === ".") return
            const tokenInfo = [await upbit(coin), await bithumb(coin), await coinone(coin), await binance(coin),
            await mexc(coin), await bybit(coin), await okx(coin), await coinmarketcap(coin)];

            var upbitOutput = "업비트 : " + (tokenInfo[0].changeRate * 100).toFixed(1) + " %\n";
            upbitOutput += " ㄴ 현재가 : " + (Math.round(tokenInfo[0].currentKrwPirce * 10) / 10).toLocaleString('en') + " KRW\n";
            upbitOutput += " ㄴ 고가 : " + (Math.round(tokenInfo[0].high_price * 10) / 10).toLocaleString('en') + " KRW\n";
            upbitOutput += " ㄴ 저가 : " + (Math.round(tokenInfo[0].low_price * 10) / 10).toLocaleString('en') + " KRW\n";

            var bithumbOutput = "빗썸 : " + (tokenInfo[1].changeRate).toFixed(1) + " %\n";
            bithumbOutput += " ㄴ 현재가 : " + (Math.round(tokenInfo[1].currentKrwPirce * 10) / 10).toLocaleString('en') + " KRW\n";
            bithumbOutput += " ㄴ 고가 : " + (Math.round(tokenInfo[1].high_price * 10) / 10).toLocaleString('en') + " KRW\n";
            bithumbOutput += " ㄴ 저가 : " + (Math.round(tokenInfo[1].low_price * 10) / 10).toLocaleString('en') + " KRW\n";

            var coinoneOutput = "코인원 : " + (tokenInfo[2].changeRate).toFixed(1) + " %\n";
            coinoneOutput += " ㄴ 현재가 : " + (Math.round(tokenInfo[2].currentKrwPirce * 10) / 10).toLocaleString('en') + " KRW\n";
            coinoneOutput += " ㄴ 고가 : " + (Math.round(tokenInfo[2].high_price * 10) / 10).toLocaleString('en') + " KRW\n";
            coinoneOutput += " ㄴ 저가 : " + (Math.round(tokenInfo[2].low_price * 10) / 10).toLocaleString('en') + " KRW\n";

            var binanceOutput = "Binace : " + (tokenInfo[3].changeRate).toFixed(1) + "%\n";
            binanceOutput += " ㄴ 현재가 : " + Math.round(tokenInfo[3].currentUsdPirce * 10000) / 10000 + " USD\n";
            binanceOutput += " ㄴ 고가 : " + Math.round(tokenInfo[3].high_price * 10000) / 10000 + " USD\n";
            binanceOutput += " ㄴ 저가 : " + Math.round(tokenInfo[3].low_price * 10000) / 10000 + " USD\n";

            var mexcOutput = "MEXC : " + (tokenInfo[4].changeRate) + " %\n";
            mexcOutput += " ㄴ 현재가 : " + Math.round(tokenInfo[4].currentUsdPirce * 10000) / 10000 + " USD\n";
            mexcOutput += " ㄴ 고가 : " + Math.round(tokenInfo[4].high_price * 10000) / 10000 + " USD\n";
            mexcOutput += " ㄴ 저가 : " + Math.round(tokenInfo[4].low_price * 10000) / 10000 + " USD\n";

            var bybitOutput = "Bybit : " + (tokenInfo[5].changeRate).toFixed(1) + " %\n";
            bybitOutput += " ㄴ 현재가 : " + Math.round(tokenInfo[5].currentUsdPirce * 10000) / 10000 + " USD\n";
            bybitOutput += " ㄴ 고가 : " + Math.round(tokenInfo[5].high_price * 10000) / 10000 + " USD\n";
            bybitOutput += " ㄴ 저가 : " + Math.round(tokenInfo[5].low_price * 10000) / 10000 + " USD\n";

            var okxOutput = "Okx : " + (tokenInfo[6].changeRate).toFixed(1) + " %\n";
            okxOutput += " ㄴ 현재가 : " + Math.round(tokenInfo[6].currentUsdPirce * 10000) / 10000 + " USD\n";
            okxOutput += " ㄴ 고가 : " + Math.round(tokenInfo[6].high_price * 10000) / 10000 + " USD\n";
            okxOutput += " ㄴ 저가 : " + Math.round(tokenInfo[6].low_price * 10000) / 10000 + " USD\n";

            var coinmarketcapOutput = "Coinmarketcap : " + Number(tokenInfo[7].changeRate).toFixed(1) + " %\n";
            coinmarketcapOutput += " ㄴ 현재가 : " + Math.round(Number(tokenInfo[7].currentUsdPirce) * 10000) / 10000 + " USD\n";
            coinmarketcapOutput += " ㄴ 도미 : " + tokenInfo[7].domi + " %";

            const outputArray: string[] = [];
            tokenInfo[0].currentKrwPirce !== -1 ? outputArray.push(upbitOutput) : null
            tokenInfo[1].currentKrwPirce !== -1 ? outputArray.push(bithumbOutput) : null
            tokenInfo[2].currentKrwPirce !== -1 ? outputArray.push(coinoneOutput) : null
            tokenInfo[3].currentUsdPirce !== -1 ? outputArray.push(binanceOutput) : null
            tokenInfo[4].currentUsdPirce !== -1 ? outputArray.push(mexcOutput) : null
            tokenInfo[5].currentUsdPirce !== -1 ? outputArray.push(bybitOutput) : null
            tokenInfo[6].currentUsdPirce !== -1 ? outputArray.push(okxOutput) : null
            tokenInfo[7].currentUsdPirce !== -1 ? outputArray.push(coinmarketcapOutput) : null

            outputArray.length > 2 ? outputArray.splice(2, 0, '\u200b'.repeat(500)) : null

            var output = "[" + tokenInfo[7].name + "/" + tokenInfo[7].symbol + "]\n";
            output += "━━━━━━━━━━━━━━\n";
            output += outputArray[0] !== undefined ? outputArray[0] + "\n" : ""
            output += outputArray[1] !== undefined ? outputArray[1] : ""
            output += outputArray[2] !== undefined ? outputArray[2] + "\n" : ""
            output += outputArray[3] !== undefined ? outputArray[3] + "\n" : ""
            output += outputArray[4] !== undefined ? outputArray[4] + "\n" : ""
            output += outputArray[5] !== undefined ? outputArray[5] + "\n" : ""
            output += outputArray[6] !== undefined ? outputArray[6] + "\n" : ""
            output += outputArray[7] !== undefined ? outputArray[7] + "\n" : ""
            output += outputArray[8] !== undefined ? outputArray[8] : ""
            msg.replyText(output).catch(
                function (error) {
                    Logger.error(error.message, error.stack)
                }
            )
        }
        catch (e) {
            Logger.error(e)
            msg.replyText("존재하지 않는 코인/티커입니다.");
        }
    };
}