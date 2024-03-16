import { Logger } from '@nestjs/common';
import axios from 'axios';

const swapscannerApiLink = "https://api.swapscanner.io/api/v2/stats/tokens";
const krw = "https://api.swapscanner.io/api/forex"

const tokenInfo = async (tokenAddress: string) => {
    try {
        const html = await axios.get(swapscannerApiLink);

        const tokenData = await html.data.filter(
            (token: any) => token.address === tokenAddress
        );

        const closeUsdPrice: number = await tokenData[0].prices[0];
        const currentUsdPirce: number = await tokenData[0].prices[1];
        const changeRate: number = (currentUsdPirce / closeUsdPrice - 1) * 100;

        return {
            closeUsdPrice,
            currentUsdPirce,
            changeRate,
        };
    } catch (e) {
        Logger.error(e)
    }
};


const krwInfo = async () => {
    try {
        const html = await axios.get(krw);
        const currency = await html.data["KRW"];

        return await currency;
    } catch (e) {
        console.log(e);
    }
};


export { tokenInfo, krwInfo };
