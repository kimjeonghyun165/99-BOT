import { Logger } from '@nestjs/common';
import axios from 'axios';

const tokenInfo = async (tokenTicker: string) => {

    try {

        const upbitapiLink = "https://api.bithumb.com/public/ticker/" + tokenTicker.toUpperCase();

        const html = await axios.get(upbitapiLink)
        const currentKrwPirce: number = Number(await html.data.data.closing_price)
        const changeRate: number = Number(await html.data.data.fluctate_rate_24H)
        const high_price: number = Number(await html.data.data.max_price)
        const low_price: number = Number(await html.data.data.min_price)

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
