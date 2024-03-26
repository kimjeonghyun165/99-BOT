import { Logger } from '@nestjs/common';
import axios from 'axios';

const tokenInfo = async (tokenTicker: string) => {
    try {
        const coinoneapiLink =
            "https://api.coinone.co.kr/public/v2/ticker_new/KRW/" +
            tokenTicker.toUpperCase() +
            "?additional_data=false";

        const html = await axios.get(coinoneapiLink);

        const currentKrwPirce: number = Number(
            await html.data.tickers[0].last
        );
        const changeRate: number =
            (Number(await html.data.tickers[0].last) / Number(await html.data.tickers[0].first) - 1) * 100
        const high_price: number = Number(
            await html.data.tickers[0].high
        );
        const low_price: number = Number(
            await html.data.tickers[0].low
        );

        return {
            currentKrwPirce,
            changeRate,
            high_price,
            low_price,
        };
    } catch (e) {
        Logger.error(e)
        return {
            currentKrwPirce: -1,
            changeRate: -1,
            high_price: -1,
            low_price: -1,
        };
    }
};

export { tokenInfo };
