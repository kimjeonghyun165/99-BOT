import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Message } from '@remote-kakao/core';
import { Connection } from 'mongoose';
import { getStatusArray } from 'src/lib/utils';
import { toothpasteInfo, usdtInfo } from '../../tokenInfo';
import { def, dex, factions, luk, lukEffect } from './data';
import { findOwner } from './owner';

@Injectable()
export class fidelSimulationHandler {
    constructor(@InjectConnection() private readonly connection: Connection) { }
    name = '$시뮬 ';
    regex = new RegExp(`^\\$시뮬 `);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const volumeCollection = this.connection.collection('fidelion');
            const wallet = msg.content.slice(4);
            const fidelionData = await findOwner(wallet)

            let minRevenue = 0;
            let regularRevenue = 0;
            let maxRevenue = 0;

            const statusCounts: { [key: string]: number } = {
                'Regular': 0,
                'Fortune': 0,
                'BackFire': 0
            };

            const fidelionItems = await Promise.all(fidelionData.map(async (item: any) => {

                const details = await volumeCollection.findOne({ name: item });

                const data = {
                    level: details.level,
                    def: details.def,
                    luk: details.luk,
                    dex: details.dex,
                    factions: details.factions
                }
                const working = data.level === 1 ? 1 : data.level === 50 ? 5 : (data.level / 10) + 1
                const filteredFactions = Object.entries(factions)
                    .filter(([factionName, _]) => !data.factions.includes(factionName))
                    .map(([_, factionInfo]) => factionInfo);
                const factionInfo = filteredFactions[0];

                const bRevenue = {
                    max: factionInfo.maxReward * def[data.def],
                    regular: factionInfo.regularReward * def[data.def],
                    min: factionInfo.minReward * def[data.def]
                }

                console.log(def[data.def])

                const fRevenue = {
                    max: factionInfo.maxReward * lukEffect[data.luk],
                    regular: factionInfo.regularReward * lukEffect[data.luk],
                    min: factionInfo.minReward * lukEffect[data.luk]
                }

                console.log(lukEffect[data.luk])
                const rRevenue = {
                    max: factionInfo.maxReward,
                    regular: factionInfo.regularReward,
                    min: factionInfo.minReward
                }
                const regular = 1 - factionInfo.backFire - (factionInfo.fortune * luk[data.luk])

                const count = Math.floor(30 / ((factionInfo.time) - (factionInfo.time * (dex[data.dex] - 1))))
                console.log(count)
                const status = getStatusArray(factionInfo.backFire, (factionInfo.fortune) * luk[data.luk], regular, (working * count))

                status.map((item: string) => {
                    statusCounts[item]++;
                    const revenue = item === 'Regular' ? rRevenue : 'Fortune' ? fRevenue : bRevenue
                    minRevenue += (revenue.min - factionInfo.cost)
                    regularRevenue += (revenue.regular - factionInfo.cost)
                    maxRevenue += (revenue.max - factionInfo.cost)
                })
            }));

            const currency = (await usdtInfo()).usdtPrice;
            const toothpastePrice = (await toothpasteInfo()).toothpastePrice;
            const toothpasteKrwPrice = toothpastePrice * currency;


            const nftAmt = fidelionData.length

            var output = "해당 지갑의 피델 시뮬결과입니다.\n" + '\u200b'.repeat(500)
            output += "보유 NFT 수 : " + nftAmt + " 개\n\n"
            output += "[루팅 결과]\n"
            output += "BackFire : " + statusCounts.BackFire + "회\n"
            output += "Fortune : " + statusCounts.Fortune + "회\n"
            output += "Regular : " + statusCounts.Regular + "회\n\n"
            output += "[예상 수익]\n"
            output += "최소수익 : " + minRevenue.toLocaleString('en') + "개(" + Math.floor(minRevenue * toothpasteKrwPrice).toLocaleString('en') + " 원)\n"
            output += "평균수익 : " + regularRevenue.toLocaleString('en') + "개(" + Math.floor(regularRevenue * toothpasteKrwPrice).toLocaleString('en') + " 원)\n"
            output += "최대수익 : " + maxRevenue.toLocaleString('en') + "개(" + Math.floor(maxRevenue * toothpasteKrwPrice).toLocaleString('en') + " 원)\n\n"
            output += "공개된 확률값을 바탕으로 임의로 1개월 치 꾸준히 루팅했다는 전제하에 나오는 시뮬레이션 값입니다."

            msg.replyText(output);
        } catch (error) {
            msg.replyText('해당 데이터가 없거나 명령어가 잘못되었습니다.');
            Logger.error(error.message, error.stack);
        }
    }
}
