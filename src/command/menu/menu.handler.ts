import { Injectable } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { menuList } from './menuData';

@Injectable()
export class menuHandler {
    name = 'ㅁㅁㅈ'
    regex = new RegExp(`^ㅁㅁㅈ$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        await msg.replyText(
            msg.sender.name +
            "님 오늘 메뉴는 이거 어떠세요?\n\n" +
            "🍽 " +
            menuList[Math.floor(Math.random() * menuList.length)]
        );
    };
}