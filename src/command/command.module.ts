import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { coinHandler, domiHandler, exchangeHandler, gewiHandler, gimpHandler } from './coin/index'
import { hanRiverHandler } from './hanRiver/hanRiver.handler';
import { helpHandler, help2Handler } from './help/index'
import { menuHandler } from './menu/menu.handler';
import { korStockHandler, currencyHandler } from './stock/index'
import { tarotHandler, charmHandler } from './tarot'
import { sneakersInfoHandler, superWalkCoinInfoHandler, superWalkLevelHandler, m2eCoinInfoHandler, shrCointoKrwHandler, shrKrwtoCoinHandler, fidelionCoinInfoHandler, fidelLionLevelHandler, fidelCombinationHandler, fidelSimulationHandler } from './m2e/index'
import { daychatHandler } from './chat/day.handler';
import { UserSchema } from 'src/users/schemas/user.schemas';
import { RoomSchema } from 'src/room/schemas/room.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { monthchatHandler } from './chat/month.handler';
import { alldaysChatHandler } from './chat/alldays.handler';
import { coinnessAlarmHandler, superwalkAlarmHandler } from './alarm';
import { marketingHandler } from './announce/marketing';
import { announceHandler } from './announce/announce';
import { nftRegisterHandler } from './nft/opensea/register.handler';
import { OpenseaSchema } from './nft/opensea/opensea.schemas';
import { nftInfoHandler } from './nft/opensea/nft.handler';
import { nftListHandler } from './nft/opensea/list.handler';
import { dayRoomRankHandler } from './chat/roomRank';
import { korIpoHandler } from './stock/korea/ipo.handler';
import { superwalkVolumeHandler } from './m2e/superWalk/volume';
import { fidelionNftInfoHandler } from './m2e/fidelion/nftInfo.handler';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }, { name: 'User', schema: UserSchema }, { name: 'Opensea', schema: OpenseaSchema }])],
  providers: [
    CommandService,
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
    shrKrwtoCoinHandler,
    shrCointoKrwHandler,
    m2eCoinInfoHandler,
    daychatHandler,
    monthchatHandler,
    alldaysChatHandler,
    superwalkAlarmHandler,
    coinnessAlarmHandler,
    marketingHandler,
    announceHandler,
    exchangeHandler,
    nftRegisterHandler,
    nftInfoHandler,
    nftListHandler,
    dayRoomRankHandler,
    korIpoHandler,
    superwalkVolumeHandler,
    fidelionCoinInfoHandler,
    fidelionNftInfoHandler,
    fidelLionLevelHandler,
    fidelCombinationHandler,
    fidelSimulationHandler
  ],
})
export class CommandModule { }
