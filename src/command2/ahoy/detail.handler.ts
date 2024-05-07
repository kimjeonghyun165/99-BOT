import { Injectable } from '@nestjs/common';
import { UDPServer } from '@remote-kakao/core';
import { ICommandHandler } from '../ICommandHandler';
import { handleMessage } from 'src/lib/discord/discord';


const WebSocket = require('ws')

const clientId = process.env.PAPAGO_ID_TOKEN
const clientSecret = process.env.PAPAGO_SECRET_TOKEN

@Injectable()
export class ahoyDetailHandler implements ICommandHandler {


    async execute(client: UDPServer, address: any): Promise<void> {

        await handleMessage(client, address, "[Ahoy 공지]", "18411156474961312", "1153861431993843733", "1153863526545363046")

    }
}
