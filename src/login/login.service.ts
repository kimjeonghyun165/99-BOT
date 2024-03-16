import { Injectable, } from '@nestjs/common';
import { UDPServer } from '@remote-kakao/core';

@Injectable()
export class LoginService {
    private readonly kakaoClient: UDPServer;

    constructor() {
        this.kakaoClient = new UDPServer({ serviceName: "99bot_V3" });
    }

    async kakaoLogin(port: number) {
        return new Promise((resolve) => {
            this.kakaoClient.once("message", async (msg) => {
                console.log(msg.room.id + " " + msg.room.name);
                console.log(msg.address);
                resolve({ client: this.kakaoClient, address: msg.address });
            });
            this.kakaoClient.start(port);
        });
    }
}

