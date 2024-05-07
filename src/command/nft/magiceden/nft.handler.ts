import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '@remote-kakao/core';
import { Model } from 'mongoose';
import { tokenInfo } from '../../../lib/cex/upbit';
import { gewitoEth, krwtoUsd, magicEdenInfo } from '../../../lib/utils'
import { Opensea } from '../nft.schemas'



@Injectable()
export class magicEdenInfoHandler {

    constructor(
        @InjectModel('Opensea') private readonly openseaModel: Model<Opensea>,
    ) { }

    name = '메 '
    regex = new RegExp(`^메 `);

    test(content: string): boolean {
        return this.regex.test(content);
    }

    async execute(msg: Message): Promise<void> {
        try {
            const projectName = msg.content.slice(2)
            const existingData = await this.openseaModel.findOne({ name: { $in: [projectName] } });

            if (!existingData) {
                msg.replyText("등록된 데이터가 없습니다.")
                return
            }

            const data: any = (await magicEdenInfo(existingData.link)).data
            const symbol = data.symbol
            const floor_price = gewitoEth(data.floorPrice);
            const total_volume = gewitoEth((data.volumeAll)).toFixed(1)
            const listingCount = data.listedCount;

            const tokenPrice = (await tokenInfo("sol"))
            const nftKrwPrice = Math.floor(floor_price * tokenPrice.currentKrwPirce)

            let output = "[" + symbol + "]\n\n";
            output += "리스팅 : " + listingCount + " 개\n";
            output += floor_price !== null ? "바닥가 : " + floor_price.toFixed(3) + " sol" + "( ≒ " + nftKrwPrice + " 원)\n" : "바닥가 : 없음\n";
            output += "거래량 : " + total_volume + " SOL \n\n";
            output += "https://magiceden.io/marketplace/" + existingData.link;
            await msg.replyText(output);

        } catch (error) {
            Logger.error(error.message, error.stack)
        }
    }
}
