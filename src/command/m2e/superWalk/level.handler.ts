import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { krwtooUsd } from 'src/lib/utils';
import { usdtInfo, walkInfo } from '../tokenInfo'
import { costBoostWalk, costSweat, costTime, costWalk, rarecostSweat, epiccostSweat, uniquecostSweat, legendarycostSweat } from './levelData'


@Injectable()
export class superWalkLevelHandler {
    name = '!렙업 '
    regex = new RegExp(`^!렙업 `);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const currency = await krwtooUsd()
            const walkPrice = (await walkInfo()).walkPrice[0] / currency
            const rarity = msg.content.slice(4).split(" ")[0];
            const startLv = Number(msg.content.slice(7).split("~")[0]);
            const endLv = Number(msg.content.split("~")[1]);

            if (0 < startLv && startLv < endLv && endLv < 31) {
                const normalCostWalk = costWalk
                    .slice(startLv - 1, endLv - 1)
                    .reduce((a, b) => a + b, 0);

                const normalCostSweat = costSweat
                    .slice(startLv - 1, endLv - 1)
                    .reduce((a, b) => a + b, 0);

                const rareCostWalk = normalCostWalk * 1.25;

                const rareCostSweat = rarecostSweat
                    .slice(startLv - 1, endLv - 1)
                    .reduce((a, b) => a + b, 0);

                const epicCostWalk = normalCostWalk * 1.5;

                const epicCostSweat = epiccostSweat
                    .slice(startLv - 1, endLv - 1)
                    .reduce((a, b) => a + b, 0);

                const uniqueCostWalk = normalCostWalk * 1.75;

                const uniqueCostSweat = uniquecostSweat
                    .slice(startLv - 1, endLv - 1)
                    .reduce((a, b) => a + b, 0);

                const legendaryCostWalk = normalCostWalk * 2;

                const legendaryCostSweat = legendarycostSweat
                    .slice(startLv - 1, endLv - 1)
                    .reduce((a, b) => a + b, 0);

                const CostTime = costTime
                    .slice(startLv - 1, endLv - 1)
                    .reduce((a, b) => a + b, 0);

                const CostBoostWalk = costBoostWalk
                    .slice(startLv - 1, endLv - 1)
                    .reduce((a, b) => a + b, 0);

                if (rarity === "노말" || rarity === "ㄴㅁ") {
                    var output = "[신발 렙업 비용 및 시간]\n";
                    output += "━━━━━━━━━━━━━━\n";
                    output +=
                        "* 총 Sweat : " + normalCostSweat.toLocaleString("en") + " 개\n";
                    output +=
                        "* 총 Walk : " +
                        normalCostWalk.toLocaleString("en") +
                        " 개" +
                        " (" +
                        Number((walkPrice * normalCostWalk).toFixed(0)).toLocaleString(
                            "en"
                        ) +
                        " 원)\n";
                    output +=
                        "* 부스터 시간 : " + CostTime.toLocaleString("en") + " 시간\n";
                    output +=
                        "* 부스터 Walk : " +
                        CostBoostWalk.toLocaleString("en") +
                        " 개" +
                        " (" +
                        Number((walkPrice * CostBoostWalk).toFixed(0)).toLocaleString(
                            "en"
                        ) +
                        " 원)";

                    msg.replyText(output)
                } else if (rarity === "레어" || rarity === "ㄹㅇ") {
                    var output = "[신발 렙업 비용 및 시간]\n";
                    output += "━━━━━━━━━━━━━━\n";
                    output += "* 총 Sweat : " + rareCostSweat.toLocaleString('en') + " 개\n";
                    output +=
                        "* 총 Walk : " +
                        rareCostWalk.toLocaleString("en") +
                        " 개" +
                        " (" +
                        Number((walkPrice * rareCostWalk).toFixed(0)).toLocaleString("en") +
                        " 원)\n";
                    output += "* 부스터 시간 : " + CostTime + " 시간\n";
                    output +=
                        "* 부스터 Walk : " +
                        CostBoostWalk.toLocaleString('en') +
                        " 개" +
                        " (" +
                        Number((walkPrice * CostBoostWalk).toFixed(0)).toLocaleString(
                            "en"
                        ) +
                        " 원)";

                    msg.replyText(output).catch(
                        function (error) {
                            console.log(error);
                        })
                } else if (rarity === "에픽" || rarity === "ㅇㅍ") {
                    var output = "[신발 렙업 비용 및 시간]\n";
                    output += "━━━━━━━━━━━━━━\n";
                    output +=
                        "* 총 Sweat : " + epicCostSweat.toLocaleString("en") + " 개\n";
                    output +=
                        "* 총 Walk : " +
                        epicCostWalk.toLocaleString("en") +
                        " 개" +
                        " (" +
                        Number((walkPrice * epicCostWalk).toFixed(0)).toLocaleString("en") +
                        " 원)\n";
                    output += "* 부스터 시간 : " + CostTime + " 시간\n";
                    output +=
                        "* 부스터 Walk : " +
                        CostBoostWalk.toLocaleString("en") +
                        " 개" +
                        " (" +
                        Number((walkPrice * CostBoostWalk).toFixed(0)).toLocaleString(
                            "en"
                        ) +
                        " 원)";

                    msg.replyText(output)
                } else if (rarity === "유닠" || rarity === "ㅇㄴ") {
                    var output = "[신발 렙업 비용 및 시간]\n";
                    output += "━━━━━━━━━━━━━━\n";
                    output +=
                        "* 총 Sweat : " + uniqueCostSweat.toLocaleString("en") + " 개\n";
                    output +=
                        "* 총 Walk : " +
                        uniqueCostWalk.toLocaleString("en") +
                        " 개" +
                        " (" +
                        Number((walkPrice * uniqueCostWalk).toFixed(0)).toLocaleString(
                            "en"
                        ) +
                        " 원)\n";
                    output += "* 부스터 시간 : " + CostTime + " 시간\n";
                    output +=
                        "* 부스터 Walk : " +
                        CostBoostWalk.toLocaleString("en") +
                        " 개" +
                        " (" +
                        Number((walkPrice * CostBoostWalk).toFixed(0)).toLocaleString(
                            "en"
                        ) +
                        " 원)";

                    msg.replyText(output)
                } else if (
                    rarity === "레전" ||
                    rarity === "ㄹㅈ" ||
                    rarity === "래전"
                ) {
                    var output = "[신발 렙업 비용 및 시간]\n";
                    output += "━━━━━━━━━━━━━━\n";
                    output +=
                        "* 총 Sweat : " + legendaryCostSweat.toLocaleString("en") + " 개\n";
                    output +=
                        "* 총 Walk : " +
                        legendaryCostWalk.toLocaleString("en") +
                        " 개" +
                        " (" +
                        Number((walkPrice * legendaryCostWalk).toFixed(0)).toLocaleString(
                            "en"
                        ) +
                        " 원)\n";
                    output += "* 부스터 시간 : " + CostTime + " 시간\n";
                    output +=
                        "* 부스터 Walk : " +
                        CostBoostWalk.toLocaleString("en") +
                        " 개" +
                        " (" +
                        Number((walkPrice * CostBoostWalk).toFixed(0)).toLocaleString(
                            "en"
                        ) +
                        " 원)";

                    msg.replyText(output)
                }
            } else {
                msg.replyText(
                    "명령어가 틀렸습니다.\n\n[신발등급] : 노말, 레어, 에픽, 유닠, 레전\n\n[초기레벨] < [최종레벨] (1 ~ 30)\n\n예시) !렙업 유닠 1~30\n\n!엠투이명령어를 입력해보세요!!"
                );
            }
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}