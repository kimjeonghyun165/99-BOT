import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { krwtooUsd, krwtoUsd } from 'src/lib/utils';
import { walkInfo, grndInfo, frcInfo, trcInfo, fitInfo, awmInfo, klayInfo, wemixInfo, usdtInfo, toothpasteInfo, solInfo, ahoyInfo } from '../tokenInfo';

const coinmarketcap = require("../../../lib/others/coinmarketcap").tokenInfo;

@Injectable()
export class shrCointoKrwHandler {
    name = 'ㅎㅈ'
    regex = new RegExp(`^ㅎㅈ`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            var cmd = msg.content.slice(2);
            const currency2 = (await usdtInfo()).usdtPrice;
            const currency = await krwtoUsd()
            const amount = cmd.split(" ")[1].replace(/,/g, "");
            const token = cmd.split(" ")[2];

            //--------------------------------superWalk short abbr------------------------------------//

            if (
                token == "ㅇㅋ" ||
                token == "워크" ||
                token == "walk" ||
                token == "Walk" ||
                token == "WALK"
            ) {
                const walk = (await walkInfo()).walkPrice[0] / currency;
                const result = Math.floor(walk * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + "원");
            }

            else if (
                token == "ㄱㄹㄷ" ||
                token == "그라운드" ||
                token == "grnd" ||
                token == "Grnd" ||
                token == "ㄱㄹ" ||
                token == "ㄱㄹㅇㄷ"
            ) {
                const grnd = (await grndInfo()).grndPrice[0] / currency;
                const result = Math.floor(grnd * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + "원");
            }

            else if (
                token == "ㅋㄹㅇ" ||
                token == "클레이" ||
                token == "klay" ||
                token == "Klay" ||
                token == "ㅋ" ||
                token == "클" ||
                token == "ㅋㄹ"
            ) {
                const klay = (await klayInfo()).klayPrice[0] / currency;
                const result = Math.floor(klay * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + "원");
            }

            //--------------------------------sneakers short abbr------------------------------------//

            else if (token == "ㅍㅅ") {
                const result = Math.floor((((await frcInfo()).frcPrice) * currency2) * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }

            else if (token == "ㅍ") {
                const result = Math.floor((((await fitInfo()).fitPrice) * currency2) * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }

            else if (token == "ㅇㅁㅅ") {
                const result = Math.floor((((await wemixInfo()).wemixPrice) * currency2) * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }

            //--------------------------------fidelion short abbr------------------------------------//

            else if (token == "ㅊㅇ") {
                const result = Math.floor((((await toothpasteInfo()).toothpastePrice) * currency2) * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }

            else if (token == "ㅅ") {
                const result = Math.floor((((await solInfo()).solPrice)) * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }



            //--------------------------------ahoy short abbr------------------------------------//

            else if (token == "캌") {
                const result = Math.floor((((await ahoyInfo()).ahoyPrice) * currency2) * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }

            //--------------------------------others short abbr------------------------------------//

            else if (token == "ㅌㄹ") {
                const result = Math.floor((((await trcInfo()).trcPrice) * currency) * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }

            else if (token == "ㅇㅇ") {
                const result = Math.floor((((await awmInfo()).awmPrice) * currency) * Number(amount));
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }

            //--------------------------------others------------------------------------//

            else {
                const tokenMapping = {
                    'ㅂㅌ': 'btc',
                    'ㅇㄷ': 'eth',
                    'ㅌㄷ': 'usdt',
                    'ㅁㅌ': 'matic',
                    'ㅂㄹ': 'bora'
                };
                const val = tokenMapping[token] || token;
                const cryptoCoin = await coinmarketcap(val.toUpperCase())
                const _KRW: number = cryptoCoin.currentUsdPirce * currency2;
                const result = Number(amount) * _KRW;
                await msg.replyText("💰 = " + result.toLocaleString("en") + " 원");
            }
        }
        catch (error) {
            Logger.error(error.message, error.stack)
            msg.replyText("명령어를 올바르게 입력해주세요.\n예시 : ㅎㅈ 1000 ㅇㅋ");
        }
    };
}