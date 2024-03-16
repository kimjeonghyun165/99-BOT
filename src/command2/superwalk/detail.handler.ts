import { Injectable } from '@nestjs/common';
import { krwtoUsd, findMany, processArrayWithDelay } from '../../lib/utils'
import { tokenInfo } from '../../lib/dex/swapscan'
import { UDPServer } from '@remote-kakao/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'src/room/schemas/room.schemas';
import { ICommandHandler } from '../ICommandHandler';
const WebSocket = require('ws')

@Injectable()
export class superWalkDetailHandler implements ICommandHandler {

    private interval = 0;
    private reconnectInterval = 5000;
    private token = process.env.DISCORD_API_TOKEN

    constructor(
        @InjectModel('Room') private readonly roomModel: Model<Room>,
    ) { }


    async extractNumbersFromString(text: string) {
        try {
            const pattern = /[+-]?\d+(\.\d+)?/g;
            const matches = text.match(pattern);
            const numbers = matches ? matches.map(Number) : [];
            return numbers;
        }
        catch (e) {
            console.log(e)
        }
    }

    async execute(client: UDPServer, address: any): Promise<void> {

        const ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");

        const sendPayload = (payload: any) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(payload));
            }
        };

        const heartbeat = (ms: number) => {
            return setInterval(() => {
                ws.send(JSON.stringify({ op: 1, d: null }));
            }, ms);
        };

        const handleReconnect = () => {
            console.log("Reconnecting...");
            this.execute(client, address);
        };

        const handleWebSocketError = (error: Error) => {
            console.error("WebSocket error:", error);
            ws.terminate();
        };

        const handleWebSocketClose = (code: number, reason: string) => {
            console.log(`WebSocket closed with code ${code}: ${reason}`);
            ws.removeAllListeners();
            clearInterval(this.interval);
            setTimeout(handleReconnect, this.reconnectInterval);
        };

        ws.on("open", (): void => {
            const payload = {
                op: 2,
                d: {
                    token: this.token,
                    properties: {
                        $os: "linux",
                        $browser: "chrome",
                        $device: "pc",
                    },
                },
            };
            sendPayload(payload);
            console.log("WebSocket connected");
        });

        ws.on("message", async (data: string) => {
            let payload = JSON.parse(data);
            const { t, event, op, d } = payload;

            const searchQuery = { 'alarm.superWalk': true }
            const room: Room[] = await findMany(this.roomModel, searchQuery)
            switch (op) {
                case 10:
                    const { heartbeat_interval } = d;
                    this.interval = Number(heartbeat(heartbeat_interval));
                    break;
            }

            switch (t) {
                case "MESSAGE_CREATE":
                    let serverId = d.guild_id;
                    let channelId = d.channel_id;

                    if (
                        serverId === "968066264184524801" &&
                        channelId === "1119209514546233376"
                    ) {
                        let title: string = "";
                        let field: any;
                        let description: number;
                        if (title !== d.embeds[0].title) {
                            title = d.embeds[0].title;
                            field = d.embeds[0].fields;
                            description = this.extractNumbersFromString(d.embeds[0].description)[0];
                            let currency = await krwtoUsd()
                            let klayPrice = (
                                await tokenInfo("0x0000000000000000000000000000000000000000")
                            )?.currentUsdPirce;
                            let klayshoePriceKrw = (description * Number(klayPrice)) / currency;
                            let krwshoePrice = Math.round(klayshoePriceKrw);
                            if (description === undefined) return
                            var output = "[신발 거래내역]\n";
                            output += "━━━━━━━━━━━━\n";
                            output += title + "\n";
                            output +=
                                "* 판매가 : " +
                                description.toLocaleString("en") +
                                " Klay" +
                                "\n";
                            output +=
                                "\t( ≒ " + krwshoePrice.toLocaleString("en") + " 원)" + "\n";
                            output += "* 등급 : " + field[2].value + "\n";
                            output += "* 종류 : " + field[3].value + "\n";
                            output += "* 세대 : " + field[4].value + "\n";
                            output += "* 레벨 : " + field[5].value + "\n";
                            output += "* 브리딩 : " + field[6].value

                            const serailNum = room.map(room => room.serialNum);

                            await processArrayWithDelay(serailNum, 1, 500, client, output, address)
                        }
                    }

                    if (
                        serverId === "968066264184524801" &&
                        channelId === "1119209761947254825"
                    ) {
                        let title: string = "";
                        let field: any;

                        title = d.embeds[0].title;
                        field = d.embeds[0].fields;
                        console.log(title, field);

                        var output = "[신발 민팅내역]\n";
                        output += "━━━━━━━━━━━━\n";
                        output += title + "\n";
                        output += "* 등급 : " + field[2].value + "\n";
                        output += "* 종류 : " + field[3].value + "\n";
                        output += "* 세대 : " + field[4].value + "\n";
                        output += "* 부모 : " + field[8].value + "+" + field[14].value;
                        const serailNum = room.map(room => room.serialNum);
                        await processArrayWithDelay(serailNum, 1, 500, client, output, address)
                    }
                    break;

                case "READY":
                    console.log("WebSocket connection is ready");
                    break;
            }
        })


        ws.on("error", handleWebSocketError);
        ws.on("close", handleWebSocketClose);

    }
}
