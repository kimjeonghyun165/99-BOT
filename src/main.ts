import { ConfigService } from '@nestjs/config/dist/config.service';
import { NestFactory } from '@nestjs/core';
import { UDPServer } from '@remote-kakao/core';
import { AppModule } from './app.module';
import { CommandService } from './command/command.service';
import { Command2Service } from './command2/command2.service';
import { LoginService } from './login/login.service';
import { RoomService } from './room/room.service';
import { UsersService } from './users/users.service';

const schedule = require('node-schedule');

interface KakaoLoginResult {
  client: UDPServer;
  address: any;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loginService = app.get(LoginService);
  const commandService = app.get(CommandService)
  const command2Service = app.get(Command2Service)
  const roomService = app.get(RoomService)
  const userService = app.get(UsersService)
  await app.listen(3010, async () => {
    const kakaoLoginResult = await loginService.kakaoLogin(3005) as KakaoLoginResult;
    const kakaoClient = kakaoLoginResult.client;
    const command2 = async () => {
      await command2Service.register(kakaoClient, address);
    };
    let address = kakaoLoginResult.address;
    userService.user(kakaoClient);
    roomService.room(kakaoClient);
    command2Service.superWalkDetailHandler(kakaoClient, address);
    command2Service.fideLionDetailHandler(kakaoClient, address);
    command2Service.ahoyDetailHandler(kakaoClient, address);
    setInterval(command2, 30000);
    schedule.scheduleJob('0 0 * * *', userService.resetDayCount.bind(this));
    schedule.scheduleJob('0 0 1 * *', userService.resetMonthCount.bind(this));
    commandService.register(kakaoClient, address);
  })
}
bootstrap();
