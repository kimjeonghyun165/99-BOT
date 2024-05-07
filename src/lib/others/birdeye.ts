import { Logger } from "@nestjs/common";
import axios from 'axios';


const tokenInfo = async (tokenTikcer: string, chain: string) => {
    try {

        const API_KEY = process.env.BIRDEYE_API_TOKEN

        const config = {
            headers: {
                'X-API-KEY': API_KEY,
                'x-chain': chain
            }
        };
        const birdeyeApiLink =
            "https://public-api.birdeye.so/defi/multi_price?list_address=" + tokenTikcer

        const html = await axios.get(birdeyeApiLink, config)

        const currentUsdPirce = await html.data.data[tokenTikcer].value
        const changeRate = await html.data.data[tokenTikcer].priceChange24h

        return {
            currentUsdPirce,
            changeRate,
        };
    } catch (e) {
        Logger.error(e)
    }
};

export { tokenInfo };
