import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { toothpasteInfo, usdtInfo } from '../../tokenInfo';
import { costdef, costdex, costluck, costnft } from './data';

@Injectable()
export class fidelLionLevelHandler {
    name = '$렙업 ';
    regex = new RegExp(`^\\$렙업 `);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const currency = (await usdtInfo()).usdtPrice;
            const toothpastePrice = (await toothpasteInfo()).toothpastePrice;
            const toothpasteKrwPrice = toothpastePrice * currency;

            const cmd = msg.content.slice(4).split(' ');

            let output = '';
            let costToothpaste = 0;

            const startLv = Number(cmd[1]);
            const endLv = Number(cmd[2]);

            if (startLv >= endLv || endLv >= 91) {
                throw console.log("조건을 다시 설정해주세요.");
            } else {
                switch (cmd[0].toLowerCase()) {
                    case 'def':
                    case '디':
                        costToothpaste = costdef.slice(startLv + 1, endLv + 1).reduce((a, b) => a + b, 0);
                        output = '[DEF 렙업 비용]\n';
                        break;
                    case 'luk':
                    case '럭':
                        costToothpaste = costluck.slice(startLv + 1, endLv + 1).reduce((a, b) => a + b, 0);
                        output = '[LUK 렙업 비용]\n';
                        break;
                    case 'dex':
                    case '덱':
                        costToothpaste = costdex.slice(startLv + 1, endLv + 1).reduce((a, b) => a + b, 0);
                        output = '[DEX 렙업 비용]\n';
                        break;
                    default:
                        const startlv = Number(cmd[0]);
                        const endlv = Number(cmd[1]);
                        if (startlv == 0 || endlv >= 51) {
                            throw console.log("조건을 다시 설정해주세요.");
                        } else {
                            costToothpaste = costnft.slice(startlv - 1, endlv - 1).reduce((a, b) => a + b, 0);
                            output = '[NFT 렙업 비용]\n';
                        }
                        break;
                }
            }

            if (output) {
                output += '━━━━━━━━━━━━━━\n';
                output +=
                    `* 2080 : ${costToothpaste.toLocaleString('en')} 개\n` +
                    ` ㄴ KRW: ${Number((costToothpaste * toothpasteKrwPrice).toFixed(0)).toLocaleString('en')} 원\n` +
                    ` ㄴ USD: ${(costToothpaste * toothpastePrice).toLocaleString('en')} $`;

                msg.replyText(output);
            }
            else {
                console.log('')
            }

        } catch (error) {
            msg.replyText('명령어가 잘못되었습니다.');
            Logger.error(error.message, error.stack);
        }
    }
}
