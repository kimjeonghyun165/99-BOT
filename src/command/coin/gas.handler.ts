import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import axios from 'axios';

@Injectable()
export class gewiHandler {
    name = '!가스' || '!기위'
    regex = new RegExp(`^!가스$` || `^!기위$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const htmlEth = await axios.get(
                "https://api.upbit.com/v1/ticker?markets=KRW-ETH"
            );
            const ethPrice: number = htmlEth.data[0].trade_price;

            const htmlgas = await axios.get(
                "https://api.etherscan.io/api?module=gastracker&action=gasoracle"
            );
            const SafeGasPrice: number = Number(htmlgas.data.result.SafeGasPrice);
            const ProposeGasPrice: number = Number(htmlgas.data.result.ProposeGasPrice);
            const FastGasPrice: number = Number(htmlgas.data.result.FastGasPrice);

            let output =
                "현재 이더리움 네트워크 평균 가스비입니다.\n━━━━━━━━━━━━━━\n";
            output +=
                "😁 SAFE : " +
                SafeGasPrice +
                " Gwei( ≒ " +
                Math.round(SafeGasPrice * ethPrice * 0.000021) +
                " 원)\n\n";
            output +=
                "😃 AVERAGE : " +
                ProposeGasPrice +
                " Gwei( ≒ " +
                Math.round(ProposeGasPrice * ethPrice * 0.000021) +
                " 원)\n\n";
            output +=
                "🙂 HIGH : " +
                FastGasPrice +
                " Gwei( ≒ " +
                Math.round(FastGasPrice * ethPrice * 0.000021) +
                " 원)\n\n";
            output += "https://etherscan.io/gastracker";

            await msg.replyText(output);
        }
        catch (error) {
            Logger.error(error.message, error.stack)
        }
    }
}