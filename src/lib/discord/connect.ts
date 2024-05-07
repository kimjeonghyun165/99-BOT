import { createWebSocketConnection } from "./discord";

const WebSocket = require('ws')

export const handleReconnect = async (connection: any) => {
    console.log("Reconnecting...");
    await createWebSocketConnection();
    console.log("reConnected!!")
};

export const sendPayload = (ws: any, payload: any) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
    }
};

export const heartbeat = (ws: any, ms: number) => {
    return setInterval(() => {
        ws.send(JSON.stringify({ op: 1, d: null }));
    }, ms);
};
