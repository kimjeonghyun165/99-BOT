import { Injectable } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { charmData } from './charmData';

@Injectable()
export class charmHandler {
    name = '!냥부적'
    regex = new RegExp(`^!냥부적$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const selectedCard = charmData[Math.floor(Math.random() * charmData.length)];
            await msg.replyText(
                msg.sender.name + "님이 냥부적을 뽑으셨습니다." + '\u200b'.repeat(500)
                + "\n\n선택된 부적 : " + selectedCard.cardName
                + "\n\n부적 의미 : " + selectedCard.meaning
                + "\n\n━━━━━━━━━━━━━━━━━━━━"
                + "\n\n상세내용은 만쥬작가님의 방으로 => https://open.kakao.com/o/g8yHh3ie"
            );
        } catch (error) { console.log(error) }
    };
}