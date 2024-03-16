import { Logger } from '@nestjs/common';
import axios from 'axios';

const tokenInfo = async (tokenAddress: string) => {
    try {
        const allbitApiLink = "https://api.allbit.com/chart/v1/klaytn/tokens/stats/" + tokenAddress + "/KRW?currency=KRW"
        const html = await axios.get(allbitApiLink)

        const currentKrwPrice: number = await html.data.oracle[0].priceKrw
        const changeRate: number = await html.data.change

        return {
            currentKrwPrice,
            changeRate
        }
    }
    catch (e) {
        Logger.error(e)
    }

}

export { tokenInfo }
