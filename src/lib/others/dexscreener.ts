import { Logger } from "@nestjs/common";
import { formatTimeDifference } from "../utils"
import axios from 'axios';

const tokenInfo = async (tokenTikcer: string) => {
    try {
        const nowTimestamp = new Date().getTime();

        const dexscreenerApiLink = `https://api.dexscreener.com/latest/dex/search?q=${tokenTikcer}`;
        const html = await axios.get(dexscreenerApiLink);
        const { chainId, dexId, baseToken, volume, priceUsd, priceChange, liquidity, fdv, url } = html.data.pairs[0];
        const { symbol, name } = baseToken;
        const { h24: vol } = volume;
        const currentUsdPrice = priceUsd;
        const fullySupply = fdv


        const pairCreatedAt = await html.data.pairs.map((item: any) => item.pairCreatedAt)
        const age = formatTimeDifference(Math.min(...pairCreatedAt), nowTimestamp)

        const { h24: changeRate } = priceChange;
        const { usd: liq } = liquidity;

        if (chainId === "solana") {
            const gmgnApilink = "https://gmgn.ai/defi/quotation/v1/tokens/sol/search?q=" + tokenTikcer
            const html = await axios.get(gmgnApilink);
            var { renounced_mint: mintable, renounced_freeze_account: freeze, burn_ratio } = html.data.data.tokens[0]
        }
        else if (chainId === "ethereum") {
            const gmgnApilink = "https://gmgn.ai/defi/quotation/v1/tokens/eth/search?q=" + tokenTikcer
            const html = await axios.get(gmgnApilink);
            var { mintable, freeze, burn_ratio } = html.data.data.tokens[0]
        }

        else return

        return {
            chainId,
            dexId,
            symbol,
            name,
            vol,
            currentUsdPrice,
            changeRate,
            fullySupply,
            liq,
            url,
            mintable,
            freeze,
            age,
            burn_ratio
        };
    } catch (error) {
        Logger.error(error);
        throw error;
    }
};

export { tokenInfo };
