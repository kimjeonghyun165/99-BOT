import { Message, UDPServer } from "@remote-kakao/core";

export interface ICommandHandler {
    execute: (message: Message, client?: UDPServer, address?: any) => Promise<void>;
    test: (content: string) => boolean;
    name: string;
    regex?: RegExp;
}