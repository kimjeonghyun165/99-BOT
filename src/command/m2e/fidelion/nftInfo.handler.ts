import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { nftData } from './data';

@Injectable()
export class fidelionNftInfoHandler {
    name = '$피델 '
    regex = new RegExp(`^\\$피델 `);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const cmd = msg.content.slice(3).trim();
            let data;

            if (!cmd) { // 명령어가 없는 경우, 기본값으로 처리
                data = await nftData("1", "50", "1", "8");
            } else {
                const parts = cmd.split(" ");

                if (parts.length === 2 && parts[0].includes("~") && parts[1].includes("~")) { // "5~30 2~4" 형태의 명령어 처리
                    const levels = parts[0].split("~");
                    const factions = parts[1].split("~");
                    data = await nftData(levels[0], levels[1], factions[0], factions[1]);
                } else if (parts.length === 2 && parts[1].includes("~")) { // "30 1~3" 형태의 명령어 처리
                    const level = parts[0];
                    const factions = parts[1].split("~")
                    data = await nftData(level, level, factions[0], factions[1]);
                } else if (parts.length === 2 && parts[0].includes("~")) { // "1~30 4" 형태의 명령어 처리
                    const levels = parts[0].split("~");
                    const faction = parts[1];
                    data = await nftData(levels[0], levels[1], faction, faction);
                } else if (parts.length === 2) { // "30 4" 형태의 명령어 처리
                    const level = parts[0];
                    const faction = parts[1];
                    data = await nftData(level, level, faction, faction);
                } else if (parts.length === 1 && parts[0].includes("~")) { // "1~30" 형태의 명령어 처리
                    const levels = parts[0].split("~");
                    data = await nftData(levels[0], levels[1], "1", "8");
                } else if (parts.length === 1) { // "25" 형태의 명령어 처리
                    const level = parts[0];
                    data = await nftData(level, level, "1", "8");
                } else {
                    throw new Error("올바르지 않은 명령어 형식입니다.");
                }
            }


            const price = data.price === 0 ? "매물없음" : data.price.toFixed(2) + " Sol"
            const krwPrice = data.krwPrice === "0" ? "매물없음" : data.krwPrice + " 원"

            var output = "[Fidel Nft Info]\n\n";
            output += "수량 : " + data.count + " 개\n"
            output += "리스팅 : " + data.listing + "개\n"
            output += "바닥가 : " + price + " \n"
            output += "원화 : " + krwPrice + " \n\n"
            output += "https://www.tensor.trade/trade/fidelion"

            await msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}