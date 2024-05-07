import { UDPServer } from "@remote-kakao/core";

export interface ICommandHandler {
    execute: (client: UDPServer, address: any) => Promise<void>
}