import { Injectable, Logger } from '@nestjs/common';
import { Message, UDPServer } from '@remote-kakao/core';
import { ICommandHandler } from './ICommandHandler';
import { hanRiverHandler } from './hanRiver/hanRiver.handler'
import { helpHandler, help2Handler } from './help/index';
import { menuHandler } from './menu/menu.handler';
import { tarotHandler, charmHandler } from './tarot/index';
import { currencyHandler, korStockHandler } from './stock/index';
import { coinHandler, exchangeHandler, domiHandler, gewiHandler, gimpHandler } from './coin/index';
import {
    sneakersInfoHandler, superWalkCoinInfoHandler, m2eCoinInfoHandler, superWalkLevelHandler, shrCointoKrwHandler,
    shrKrwtoCoinHandler, fidelionCoinInfoHandler, fidelionNftInfoHandler, fidelLionLevelHandler, fidelCombinationHandler, fidelSimulationHandler
} from './m2e/index'
import { daychatHandler, monthchatHandler, alldaysChatHandler } from './chat/index';
import { coinnessAlarmHandler, superwalkAlarmHandler } from './alarm';
import { marketingHandler } from './announce/marketing';
import { announceHandler } from './announce/announce';
import { nftRegisterHandler } from './nft/opensea/register.handler';
import { nftInfoHandler } from './nft/opensea/nft.handler';
import { nftListHandler } from './nft/opensea/list.handler';
import { dayRoomRankHandler } from './chat/roomRank';
import { korIpoHandler } from './stock/korea/ipo.handler';
import { superwalkVolumeHandler } from './m2e/superWalk/volume';

@Injectable()
export class CommandService {

    commandHandlers: ICommandHandler[] = [];

    constructor(
        private readonly hanRiverHandler: hanRiverHandler,
        private readonly helpHandler: helpHandler,
        private readonly help2Handler: help2Handler,
        private readonly menuHandler: menuHandler,
        private readonly tarotHandler: tarotHandler,
        private readonly charmHandler: charmHandler,
        private readonly currencyHandler: currencyHandler,
        private readonly korStockHandler: korStockHandler,
        private readonly coinHandler: coinHandler,
        private readonly exchangeHandler: exchangeHandler,
        private readonly domiHandler: domiHandler,
        private readonly gimpHandler: gimpHandler,
        private readonly gewiHandler: gewiHandler,
        private readonly sneakersInfoHandler: sneakersInfoHandler,
        private readonly superWalkCoinInfoHandler: superWalkCoinInfoHandler,
        private readonly m2eCoinInfoHandler: m2eCoinInfoHandler,
        private readonly superWalkLevelHandler: superWalkLevelHandler,
        private readonly shrCointoKrwHandler: shrCointoKrwHandler,
        private readonly shrKrwtoCoinHandler: shrKrwtoCoinHandler,
        private readonly daychatHandler: daychatHandler,
        private readonly monthchatHandler: monthchatHandler,
        private readonly alldayschatHandler: alldaysChatHandler,
        private readonly coinnessAlarmHandler: coinnessAlarmHandler,
        private readonly superwalkAlarmHandler: superwalkAlarmHandler,
        private readonly marketingHandler: marketingHandler,
        private readonly announceHandler: announceHandler,
        private readonly nftRegisterHandler: nftRegisterHandler,
        private readonly nftInfoHandler: nftInfoHandler,
        private readonly nftListHandler: nftListHandler,
        private readonly dayRoomRankHandler: dayRoomRankHandler,
        private readonly korIpoHandler: korIpoHandler,
        private readonly superwalkVolume: superwalkVolumeHandler,
        private readonly fidelionCoinInfoHandler: fidelionCoinInfoHandler,
        private readonly fidelionNftInfoHandler: fidelionNftInfoHandler,
        private readonly fidelLionLevelHandler: fidelLionLevelHandler,
        private readonly fidelCombinationHandler: fidelCombinationHandler,
        private readonly fidelSimulationHandler: fidelSimulationHandler

    ) {
        this.commandHandlers = [
            hanRiverHandler,
            helpHandler,
            help2Handler,
            menuHandler,
            tarotHandler,
            charmHandler,
            currencyHandler,
            korStockHandler,
            coinHandler,
            domiHandler,
            gimpHandler,
            gewiHandler,
            sneakersInfoHandler,
            superWalkCoinInfoHandler,
            superWalkLevelHandler,
            m2eCoinInfoHandler,
            shrCointoKrwHandler,
            shrKrwtoCoinHandler,
            daychatHandler,
            monthchatHandler,
            alldayschatHandler,
            coinnessAlarmHandler,
            superwalkAlarmHandler,
            marketingHandler,
            announceHandler,
            nftRegisterHandler,
            nftInfoHandler,
            nftListHandler,
            dayRoomRankHandler,
            korIpoHandler,
            superwalkVolume,
            fidelionCoinInfoHandler,
            fidelionNftInfoHandler,
            fidelLionLevelHandler,
            fidelCombinationHandler,
            fidelSimulationHandler,
            exchangeHandler,
        ];
    }

    register(client: UDPServer, address: any) {
        for (const command of this.commandHandlers) {
            Logger.log(
                `${command.name} registered => ${command.regex ?? '?'
                }`,
                'CommandExplorer',
            );
        }

        client.on("message", async (message) => {
            try {
                Logger.verbose(message.time + '\t' + message.sender.name + ' : ' + message.content)
                await this.messageHandler(message, client, address);
            } catch (error) {
                Logger.error(error.message, error.stack);
            }
        });
    }

    async messageHandler(message: Message, client?: UDPServer, address?: any) {
        const { content } = message;

        for (const handler of this.commandHandlers) {
            if (handler.test(message.content)) {
                try {
                    Logger.debug(`executing command [${handler.name}] => ${content}`);
                    await handler.execute(message, client, address);
                    return;
                } catch (error) {
                    Logger.error(error.message, error.stack);
                }
            }
        }

    }
}


