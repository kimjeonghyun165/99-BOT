import { Logger } from '@nestjs/common';
import axios from 'axios';

const tokenInfo = async (tokenTicker: string) => {

    try {

        const upbitapiLink = "https://api.upbit.com/v1/ticker?markets=KRW-" + tokenTicker.toUpperCase();

        const html = await axios.get(upbitapiLink)
        const currentKrwPirce: number = Number(await html.data[0].trade_price)
        const changeRate: number = Number(await html.data[0].signed_change_rate)
        const high_price: number = Number(await html.data[0].high_price)
        const low_price: number = Number(await html.data[0].low_price)

        return {
            currentKrwPirce,
            changeRate,
            high_price,
            low_price
        }

    } catch (e) {
        Logger.error(e)
        return {
            currentKrwPirce: -1,
            changeRate: -1,
            high_price: -1,
            low_price: -1
        }
    }
}

export { tokenInfo }
