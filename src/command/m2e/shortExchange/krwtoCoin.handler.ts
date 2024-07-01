import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { krwtoUsd } from 'src/lib/utils';
import { walkInfo, grndInfo, frcInfo, trcInfo, fitInfo, awmInfo, klayInfo, wemixInfo, usdtInfo, toothpasteInfo, solInfo, ahoyInfo } from '../tokenInfo';
const coinmarketcap = require("../../../lib/others/coinmarketcap").tokenInfo;

@Injectable()
export class shrKrwtoCoinHandler {
    name = 'ㅇㅅ'
    regex = new RegExp(`^ㅇㅅ`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            var cmd = msg.content.slice(2);
            const currency2 = (await usdtInfo()).usdtPrice;
            const currency = await krwtoUsd()
            const krwAmount = cmd.split(" ")[1].replace(/,/g, "");
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
                const result = Number(krwAmount) / walk;
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + "WALK"
                );
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
                const result = Number(krwAmount) / grnd;
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + "GRND"
                );
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
                const result = Number(krwAmount) / klay;
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + "KLAY"
                );
            }

            //--------------------------------sneakers short abbr------------------------------------//

            else if (token == "ㅍㅅ") {
                const result = Number(krwAmount) / Number(((await frcInfo()).frcPrice) * currency2);
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + " FRC"
                );
            }

            else if (token == "ㅍ") {
                const result = Number(krwAmount) / Number(((await fitInfo()).fitPrice) * currency2);
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + " FRC"
                );
            }

            else if (token == "ㅇㅁㅅ") {
                const result = Number(krwAmount) / Number(((await wemixInfo()).wemixPrice) * currency2);
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + " WEMIX"
                );
            }


            //--------------------------------fidelion short abbr------------------------------------//

            else if (token == "ㅊㅇ") {
                const result = Number(krwAmount) / Number(((await toothpasteInfo()).toothpastePrice) * currency2);
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + " 치약"
                );
            }

            else if (token == "ㅅ") {
                const result = Number(krwAmount) / Number(((await solInfo()).solPrice));
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + " SOL"
                );
            }

            //--------------------------------ahoy short abbr------------------------------------//


            else if (token == "캌") {
                const result = Number(krwAmount) / Number(((await ahoyInfo()).ahoyPrice) * currency2);
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + " cac"
                );
            }

            //--------------------------------others short abbr------------------------------------//


            else if (token == "ㅌㄹ") {
                const result = Number(krwAmount) / Number(((await trcInfo()).trcPrice) * currency2);
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + " FRC"
                );
            }

            else if (token == "ㅇㅇ") {
                const result = Number(krwAmount) / Number(((await awmInfo()).awmPrice) * currency2);
                await msg.replyText(
                    "🪙 = " + Number(result.toFixed(4)).toLocaleString("en") + " WEMIX"
                );
            }
            else {
                const tokenMapping = {
                    'ㅂㅌ': 'btc',
                    'ㅇㄷ': 'eth',
                    'ㅌㄷ': 'usdt',
                    'ㅁㅌ': 'matic',
                    'ㅂㄹ': 'bora'
                };
                const val = tokenMapping[token] || token;
                const cryptoCoin = await coinmarketcap(val.toUpperCase());
                var _KRW: number = cryptoCoin.currentUsdPirce * currency2;
                var result = Number(krwAmount) / _KRW;
                await msg.replyText("🪙 = " + result.toLocaleString("en") + " " + val);
            }
        }
        catch (error) {
            Logger.error(error.message, error.stack)
            msg.replyText("명령어를 올바르게 입력해주세요.\n예시 : ㅎㅈ 1000 ㅇㅋ");
        }
    };
}