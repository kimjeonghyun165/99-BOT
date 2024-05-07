import { Injectable } from '@nestjs/common';
import { UDPServer } from '@remote-kakao/core';
import { ICommandHandler } from '../ICommandHandler';
import { handleMessage } from 'src/lib/discord/discord';


@Injectable()
export class fidelDetailHandler implements ICommandHandler {


    async execute(client: UDPServer, address: any): Promise<void> {

        await handleMessage(client, address, "[Fidelion 공지]", "18392000720314681", "986541984078524436", "1154206910489296906")

    }
}