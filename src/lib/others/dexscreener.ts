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
        var opt1: any, opt2: any, opt3: any;

        const pairCreatedAt = await html.data.pairs.map((item: any) => item.pairCreatedAt)
        const age = formatTimeDifference(Math.min(...pairCreatedAt), nowTimestamp)

        const { h24: changeRate } = priceChange;
        const { usd: liq } = liquidity;

        if (chainId === "solana") {
            const gmgnApilink = "https://gmgn.ai/defi/quotation/v1/tokens/sol/search?q=" + tokenTikcer
            const html = await axios.get(gmgnApilink);
            var { renounced_mint, renounced_freeze_account, burn_ratio } = html.data.data.tokens[0]

            opt1 = renounced_mint === 1 ? "✅ NO MINT" : renounced_mint === 0 ? "❗NO MINT" : "❓Unknown";
            opt2 = renounced_freeze_account === 1 ? "✅ NO FREEZE" : renounced_freeze_account === 0 ? "❗NO FREEZE" : "❓Unknown";
            opt3 = burn_ratio === burn_ratio ? "\n🔥Burn : " + parseFloat(burn_ratio) * 100 + " %" : "🔥Burn : ❓Unknown"
        }
        else if (chainId === "ethereum") {
            const gmgnApilink = "https://gmgn.ai/defi/quotation/v1/tokens/eth/search?q=" + tokenTikcer
            const html = await axios.get(gmgnApilink);
            var { is_honeypot, is_open_source, renounced } = html.data.data.tokens[0]

            opt1 = is_honeypot === 1 ? "❗NO Honeypot" : is_honeypot === 0 ? "✅ NO Honeypot" : "❓Unknown";
            opt2 = is_open_source === 1 ? "✅ Verified " : is_open_source === 0 ? "❗Verified" : "❓Unknown";
            opt3 = renounced === 1 ? "\n🔥Renounced : ✅ Yes" : renounced === 0 ? "\n🔥Renounced : ❗NO" : "\n🔥Renounced : ❓Unknown";
        }

        else {
            opt1 = ""
            opt2 = ""
            opt3 = ""
        }

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
            opt1,
            opt2,
            opt3,
            age
        };
    } catch (error) {
        Logger.error(error);
        throw error;
    }
};

export { tokenInfo };
