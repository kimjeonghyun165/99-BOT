import { Logger } from '@nestjs/common';
import axios from 'axios';

const klayswapApiLink = "https://ss.klayswap.com/stat/tokenInfo.json";

const tokenInfo = async (tokenAddress: string) => {
    try {
        const html = await axios.get(klayswapApiLink);

        const tokenData = await html.data.filter(
            (token: any) => token.address === tokenAddress
        );

        const currentUsdPirce: number = await tokenData[0].price;

        return currentUsdPirce;
    } catch (e) {
        Logger.error(e)
    }
};

export { tokenInfo };
