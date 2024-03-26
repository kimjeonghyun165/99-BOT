import { Injectable } from '@nestjs/common';
import { replyToRoom } from '../../lib/utils'
import { UDPServer } from '@remote-kakao/core';
import { ICommandHandler } from '../ICommandHandler';
import { translateText } from 'src/lib/translate';


const WebSocket = require('ws')

const clientId = process.env.PAPAGO_ID_TOKEN
const clientSecret = process.env.PAPAGO_SECRET_TOKEN

@Injectable()
export class ahoyDetailHandler implements ICommandHandler {

    private interval = 0;
    private reconnectInterval = 5000;
    private token = process.env.DISCORD_API_TOKEN;

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
                        serverId === "1153861431993843733" &&
                        channelId === "1153863526545363046"
                    ) {
                        const content = await translateText(clientId, clientSecret, "en", "ko", d.content);
                        var output = "[CARDS AHOY 공지]\n";
                        output += "━━━━━━━━━━━━\n";
                        output += content.slice(0, 250);
                        output += `\u200b`.repeat(500);
                        output += content.slice(250);

                        await replyToRoom(client, output, "18411156474961312", address);
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
