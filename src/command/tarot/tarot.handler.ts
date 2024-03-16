import { Injectable } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { tarotData } from './tarotData';

@Injectable()
export class tarotHandler {
    name = '!타로'
    regex = new RegExp(`^!타로$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const selectedCard = tarotData[Math.floor(Math.random() * tarotData.length)];
            await msg.replyText(
                msg.sender.name + "님이 타로카드를 뽑으셨습니다." + '\u200b'.repeat(500)
                + "\n\n선택된 카드 : " + selectedCard.cardName
                + "\n\n카드 의미 : " + selectedCard.meaning
                + "\n\n━━━━━━━━━━━━━━━━━━━━"
                + "\n\n1. 성격운 : " + selectedCard.personality
                + "\n\n2. 직업운 : " + selectedCard.job
                + "\n\n3. 연애운 : " + selectedCard.romantic
                + "\n\n4. 금전운 : " + selectedCard.money
                + "\n\n━━━━━━━━━━━━━━━━━━━━"
                + "\n\n타로해석은 만쥬작가님의 방으로 => https://open.kakao.com/o/g8yHh3ie"
            );
        } catch (error) { console.log(error) }
    };
}