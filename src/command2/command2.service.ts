import { Injectable, Logger } from '@nestjs/common';
import { UDPServer } from '@remote-kakao/core';
import { coinNessHandler } from './coinness/coinness.handler';
import { ICommandHandler } from './ICommandHandler';
import { fidelDetailHandler } from './fidelion/detail.handler'
import { ahoyDetailHandler } from './ahoy/detail.handler';

@Injectable()
export class Command2Service {

    commandHandlers: ICommandHandler[] = [];

    constructor(
        private readonly coinNessHandler: coinNessHandler,
        private readonly fideLionDetail: fidelDetailHandler,
        private readonly ahoyDetail: ahoyDetailHandler,

    ) {
        this.commandHandlers = [
            coinNessHandler
        ];
    }

    async register(client: UDPServer, address: any) {
        try {
            for (const handler of this.commandHandlers) {
                await handler.execute(client, address);
            }
        } catch (error) {
            Logger.error(error.message, error.stack);
        }
    }

    async fideLionDetailHandler(client: UDPServer, address: any) {
        try {
            this.fideLionDetail.execute(client, address)
        } catch (error) {
            Logger.error(error.message, error.stack);
        }
    }

    async ahoyDetailHandler(client: UDPServer, address: any) {
        try {
            this.fideLionDetail.execute(client, address)
        } catch (error) {
            Logger.error(error.message, error.stack);
        }
    }
}
