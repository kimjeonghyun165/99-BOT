import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '@remote-kakao/core';
import { Model } from 'mongoose';
import { usdtInfo } from 'src/command/m2e/tokenInfo';
import { tokenInfo } from 'src/lib/cex/binance';
import { openseaInfo } from 'src/lib/utils'
import { Opensea } from '../nft.schemas';



@Injectable()
export class openseaInfoHandler {
    constructor(
        @InjectModel('Opensea') private readonly openseaModel: Model<Opensea>,
    ) { }

    name = '옾 '
    regex = new RegExp(`^옾 `);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const projectName = msg.content.slice(2)
            const existingData = await this.openseaModel.findOne({ name: { $in: [projectName] } });

            if (!existingData) {
                msg.replyText("등록된 줄임말이 없습니다.\n!n등록 명령어를 이용하여 줄임말을 등록해주세요")
                return
            }

            const html: any = (await openseaInfo(existingData.link))
            const data = html.data.total;
            const chain = data.floor_price_symbol
            const floor_price = data.floor_price;
            const total_volume = (data.volume).toFixed(3);
            const owner = data.num_owners;
            const count = data.sales;
            const tokenPrice = (await tokenInfo(chain))
            const currency = (await usdtInfo()).usdtPrice;
            const nftKrwPrice = ((tokenPrice.currentUsdPirce * currency) * floor_price).toFixed(1)

            let output = "[" + projectName + "]\n\n";
            output += "발행량 : " + count + " 개\n";
            output += "소유자 : " + owner + " 명\n";
            output += floor_price !== null ? "바닥가 : " + floor_price + " " + chain + "( ≒ " + nftKrwPrice + " 원)\n" : "바닥가 : 없음\n";
            output += "거래량 : " + total_volume + " ETH \n\n";
            output += "https://opensea.io/collection/" + existingData.link;
            await msg.replyText(output);

        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    }
}
