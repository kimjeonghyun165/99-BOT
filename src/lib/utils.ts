import { Logger } from "@nestjs/common";
import { UDPServer } from "@remote-kakao/core";
import axios from "axios";
import { format, parse } from "date-fns";
import { Model } from "mongoose";

export const getHtml = async (url: string) => {
    try {
        return await axios.get(url);
    } catch (error) {
        console.error(error);
    }
};

export async function sendStockInfo(
    url: string,
    name: string,
    price: string,
    rate: string,
    image: string
) {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                type: "url",
                image: image,
                title: name,
                description: "주가 : " + price + " 원 " + " (" + rate + ")",
            }),
            headers: {
                "x-api-key": "4c7b9e8c-0e21-473f-b4bb-1be466b2375d",
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result0 = (await response.json())
        const result = result0.data
        return result.viewUrl
    } catch (error) {
        if (error instanceof Error) {
            console.log("error message: ", error.message);
            return error.message;
        } else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
}


export async function krwtoUsd() {
    const krwusd = "https://api.swapscanner.io/api/forex";
    const html = await axios.get(krwusd);
    const currency = await html.data["KRW_BITHUMB"];

    return currency
}

export async function krwtooUsd() {
    const krwusd = "https://api.swapscanner.io/api/forex";
    const html = await axios.get(krwusd);
    const currency = await html.data["KRW"];

    return currency

}




export const replyToRoom = async (client: UDPServer, message: any, roomId?: string, address?: any) => {
    try {
        const addressInfo = {
            address: address.address,
            family: 'IPv4',
            port: address.port,
        }

        await client.sendText(
            addressInfo,
            0,
            'com.kakao.talk',
            roomId,
            message,
            10000,
        )
    } catch (error) {
        Logger.error(error.message, error.stack);
    }
}



export async function processArrayWithDelay(array: any, batchSize: number, delay: number, client: UDPServer, output: string, address: any) {
    for (let i = 0; i < array.length; i += batchSize) {
        const batch = array.slice(i, i + batchSize);
        for (const item of batch) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            await replyToRoom(client, output, item, address);
        }
    }
}



export async function findMany<T>(model: Model<T>, searchQuery: any): Promise<T[]> {
    try {
        const results = await model.find(searchQuery).exec();
        return results
    } catch (error) {
        Logger.error(error.message, error.stack);
        return [];
    }
}



export async function openseaInfo(link: string) {
    try {
        const html = await axios.get(
            "https://api.opensea.io/api/v2/collections/" + link + "/stats", {
            headers: {
                "x-api-key": "d95b6479a4294434bebc46b43b6f698e",
                Accept: "application/json",
            },
        }
        );
        return html;
    }
    catch (error) {
        Logger.error(error.message, error.stack);
    }
}

export async function magicEdenInfo(link: string) {
    try {
        const html = await axios.get(
            "https://api-mainnet.magiceden.dev/v2/collections/" + link + "/stats"
        );
        return html;
    }
    catch (error) {
        Logger.error(error.message, error.stack);
    }
}


export async function formatDateString(inputString: string, inputFormat: string, outputFormat: string) {
    if (inputString === "") {
        return "일정 정보 없음";
    }
    const date = parse(inputString, inputFormat, new Date());
    return format(date, outputFormat);
}

enum State {
    BackFire = 'BackFire',
    Fortune = 'Fortune',
    Regular = 'Regular'
}

const determineState = (backFire: number, fortune: number, regular: number): State => {
    // 세 가지 확률 값의 합계 계산
    const totalProbability = backFire + fortune + regular;

    // 각 상태에 대한 확률 범위 계산
    const backFireRange = backFire / totalProbability;
    const fortuneRange = backFireRange + (fortune / totalProbability);

    // 0부터 1 사이의 랜덤 값 생성
    const random = Math.random();

    // 랜덤 값이 어느 범위에 속하는지 확인하여 상태 결정
    if (random < backFireRange) {
        return State.BackFire;
    } else if (random < fortuneRange) {
        return State.Fortune;
    } else {
        return State.Regular;
    }
}

export const getStatusArray = (backFire: number, fortune: number, regular: number, working: number): State[] => {
    const statusArray: State[] = [];

    for (let i = 0; i < working; i++) {
        const status = determineState(backFire, fortune, regular);
        statusArray.push(status);
    }

    return statusArray;
}


export const extractNumbersFromString = async (text: string) => {
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


export const gewitoEth = (value: number) => {
    const result = value / 1000000000;
    return result;
}


export function formatTimeDifference(timestamp1, timestamp2) {

    const diff = Math.abs(timestamp2 - timestamp1);

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks >= 1) {
        return `${days}일`;
    }
    else if (days >= 1) {
        return `${days}일 ${hours}시간`
    }

    else {
        return `${hours}시간 ${minutes}분 ${seconds}초`;
    }
}