import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@remote-kakao/core';
import { getHtml } from 'src/lib/utils';

@Injectable()
export class currencyHandler {
    name = '!환율'
    regex = new RegExp(`^!환율$`);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            var cheerio = require("cheerio");
            let url = "https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&sq=&o=&q=%ED%99%98%EC%9C%A8";
            let html = await getHtml(url);
            let $ = cheerio.load(html.data);
            const data = {
                usaCurrecny: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(1) > td:nth-child(2) > span").text(),
                usaRate: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(1) > td:nth-child(4) > span").text(),
                jpCurrecny: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(2) > td:nth-child(2) > span").text(),
                jpRate: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(2) > td:nth-child(4) > span").text(),
                euCurrecny: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(3) > td:nth-child(2) > span").text(),
                euRate: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(3) > td:nth-child(4) > span").text(),
                chCurrecny: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(4) > td:nth-child(2) > span").text(),
                chRate: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(4) > td:nth-child(4) > span").text(),
                auCurrecny: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(5) > td:nth-child(2) > span").text(),
                auRate: $("#exchangeColl > div.coll_cont > div > div.wrap_rate > table > tbody > tr:nth-child(5) > td:nth-child(4) > span").text(),
            };
            let output = "[환율]\n\n";
            output += "미국: " + data.usaCurrecny + " 원 / " + data.usaRate + "\n";
            output += "일본: " + data.jpCurrecny + " 원 / " + data.jpRate + "\n";
            output += "유럽연합: " + data.euCurrecny + " 원 / " + data.euRate + "\n";
            output += "중국: " + data.chCurrecny + " 원 / " + data.chRate + "\n";
            output += "호주: " + data.auCurrecny + " 원 / " + data.auRate;
            msg.replyText(output);
        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    };
}
