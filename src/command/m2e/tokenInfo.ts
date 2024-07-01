import { Logger } from "@nestjs/common";

const swapscanner = require("../../lib/dex/swapscan").tokenInfo;
const klayswap = require("../../lib/dex/klayswap").tokenInfo;
const gecko = require("../../lib/others/geckoterminal").tokenInfo;
const mexc = require("../../lib/cex/mexc").tokenInfo;
const birdeye = require("../../lib/others/birdeye").tokenInfo;
const upbit = require("../../lib/cex/upbit").tokenInfo;
const coinone = require("../../lib/cex/coinone").tokenInfo;
const dexscreener = require("../../lib/others/dexscreener").tokenInfo

const toothpasteContract = "Dwri1iuy5pDFf2u2GwwsH2MxjR6dATyDv9En9Jk8Fkof";
const dedContract = "7raHqUrZXAqtxFJ2wcmtpH7SQYLeN9447vD4KhZM7tcP"
const walkContract = "0x976232eb7eb92287ff06c5d145bd0d1c033eca58";
const grndContract = "0x84f8c3c8d6ee30a559d73ec570d574f671e82647";
const klayContract = "0x0000000000000000000000000000000000000000";
const trcContract = "0x7399c6dba80b6f6a36a8f6f20053a1a9a615dab9";
const awmContract = "0x3043988aa54bb3ae4da60ecb1dc643c630a564f0";
const ahoyContract = "0xe0b1a112ee17eF376260Ad347d0D9c38eFDFfe07";
const gmtContract = "7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx";
const gstContract = "AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB"

const walkInfo = async () => {
    try {
        const walkInfo = [
            await swapscanner(walkContract),
            await klayswap(walkContract),
        ];

        const walkPrice: number[] = [
            walkInfo[0].currentUsdPirce,
            walkInfo[1]
        ];
        const walkRate: string = walkInfo[0].changeRate.toFixed(2);

        return {
            walkPrice,
            walkRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

const grndInfo = async () => {
    try {
        const grndInfo = [
            await swapscanner(grndContract),
            await klayswap(grndContract),
        ];

        const grndPrice: number[] = [
            grndInfo[0].currentUsdPirce,
            grndInfo[1],
        ];
        const grndRate: string = grndInfo[0].changeRate.toFixed(2);

        return {
            grndPrice,
            grndRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

const klayInfo = async () => {
    try {
        const klayInfo = [
            await swapscanner(klayContract),
            await klayswap(klayContract),
        ];

        const klayPrice: number[] = [klayInfo[0].currentUsdPirce, klayInfo[1]];
        const klayRate: string = klayInfo[0].changeRate.toFixed(2);

        return {
            klayPrice,
            klayRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

const wemixInfo = async () => {
    try {
        const wemixInfo = await mexc("wemix")
        const wemixPrice: number = Number(wemixInfo.currentUsdPirce)
        const wemixRate: string = wemixInfo.changeRate

        return {
            wemixPrice,
            wemixRate,
        };
    }
    catch (error) { Logger.error(error.message, error.stack) }
};

const trcInfo = async () => {
    try {
        const trcInfo = await gecko(trcContract, "polygon_pos")
        const trcPrice: number = Number(trcInfo.currentUsdPirce)
        const trcRate: string = trcInfo.changeRate

        return {
            trcPrice,
            trcRate,
        };
    }
    catch (error) { Logger.error(error.message, error.stack) }
};

const frcInfo = async () => {
    try {
        const frcInfo = await mexc("frc")
        const frcPrice: number = Number(frcInfo.currentUsdPirce)
        const frcRate = frcInfo.changeRate

        return {
            frcPrice,
            frcRate,
        };
    }
    catch (error) { Logger.error(error.message, error.stack) }
};


const fitInfo = async () => {
    try {
        const fitInfo = await mexc("fit")
        const fitPrice: number = Number(fitInfo.currentUsdPirce)
        const fitRate = fitInfo.changeRate

        return {
            fitPrice,
            fitRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

const awmInfo = async () => {
    try {
        const awmInfo = await swapscanner(awmContract)
        const awmPrice: number = awmInfo.currentUsdPirce
        const awmRate: string = awmInfo.changeRate.toFixed(2);

        return {
            awmPrice,
            awmRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

//------------------------------------피델리온-------------------------------------//

const toothpasteInfo = async () => {
    try {
        const toothpasteInfo = await dexscreener(toothpasteContract)

        const toothpastePrice: number = Number(toothpasteInfo.currentUsdPrice)
        const toothpasteRate: string = Number(toothpasteInfo.changeRate).toFixed(2);

        return {
            toothpastePrice,
            toothpasteRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

const solInfo = async () => {
    try {
        const solInfo = await upbit("sol")

        const solPrice: number = solInfo.currentKrwPirce

        const solRate: string = solInfo.changeRate.toFixed(2);

        return {
            solPrice,
            solRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

const dedInfo = async () => {
    try {
        const dedInfo = await dexscreener(dedContract)

        const dedPrice: number = Number(dedInfo.currentUsdPrice)
        const dedRate: string = Number(dedInfo.changeRate).toFixed(2);

        return {
            dedPrice,
            dedRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};


//------------------------------------Ahoy-------------------------------------//

const ahoyInfo = async () => {
    try {
        const ahoyInfo = await dexscreener(ahoyContract)

        const ahoyPrice: number = Number(ahoyInfo.currentUsdPrice)
        const ahoyRate: string = Number(ahoyInfo.changeRate).toFixed(2);

        return {
            ahoyPrice,
            ahoyRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

const usdtInfo = async () => {
    try {
        const usdtInfo = await coinone("usdt")

        const usdtPrice: number = usdtInfo.currentKrwPirce

        return {
            usdtPrice,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};


//------------------------------------Stepn-------------------------------------//

const gmtInfo = async () => {
    try {
        const gmtInfo = await dexscreener(gmtContract)

        const gmtPrice: number = Number(gmtInfo.currentUsdPrice)
        const gmtRate: string = Number(gmtInfo.changeRate).toFixed(2);

        return {
            gmtPrice,
            gmtRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

const gstInfo = async () => {
    try {
        const gstInfo = await dexscreener(gstContract)

        const gstPrice: number = Number(gstInfo.currentUsdPrice)
        const gstRate: string = Number(gstInfo.changeRate).toFixed(2);

        return {
            gstPrice,
            gstRate,
        };
    } catch (error) { Logger.error(error.message, error.stack) }
};

export {
    gstInfo, gmtInfo, walkInfo, grndInfo, klayInfo, frcInfo, wemixInfo,
    trcInfo, fitInfo, awmInfo, solInfo, toothpasteInfo, usdtInfo, dedInfo, ahoyInfo
};