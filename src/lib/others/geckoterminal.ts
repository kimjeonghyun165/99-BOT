import { Logger } from "@nestjs/common";
import axios from 'axios';

const tokenInfo = async (tokenAddress: string, network: string) => {
    try {
        const geckoterminalApiLink =
            "https://api.geckoterminal.com/api/v2/networks/" +
            network +
            "/pools/" +
            tokenAddress;

        const html = await axios.get(geckoterminalApiLink);

        const currentUsdPirce = await html.data.data.attributes.base_token_price_usd;
        const changeRate = Number(await html.data.data.attributes.price_change_percentage.h24).toFixed(2);

        return {
            currentUsdPirce,
            changeRate,
        };
    } catch (e) {
        Logger.error(e)
    }
};

export { tokenInfo };
