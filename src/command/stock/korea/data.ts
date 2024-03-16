import { Logger } from "@nestjs/common";
import { getHtml } from "src/lib/utils";
import axios from 'axios';
import { parse, addHours, isBefore, isAfter, format } from 'date-fns';

const cheerio = require("cheerio");

export async function stockLightInfo(stockName: string) {
    try {
        var stockUrl =
            "https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q=" +
            encodeURI(stockName);

        let stockResult: any = await getHtml(stockUrl).then(async (html) => {
            const $ = await cheerio.load(html.data);
            const stock = {
                name: $("#comColl > div.coll_cont > div > div.wrap_tit > strong > a > b").text(),
                num: $("#comColl > div.coll_cont > div > div.wrap_tit > strong > span").text().substring(0, 6),
                chart: $("#stockTabImg").attr("src"),
            };
            return stock;
        });
        console.log(stockResult)
        return stockResult;
    } catch (error) {
        Logger.error(error.message, error.stack)
    }

}


export async function stockDetailInfo(stockNum: string) {
    try {
        var stockUrl =
            "https://finance.naver.com/item/sise.naver?code=" + stockNum

        let stockResult: any = await getHtml(stockUrl).then(async (html) => {
            const $ = await cheerio.load(html.data);
            const cleanText = (selector) => {
                const element = $(selector);
                return element && element.text ? element.text().trim().replace(/\s+/g, ' ') : '';
            };

            const stock = {
                price: cleanText("#_nowVal"),
                rate: cleanText("#_rate > span"),
                change: cleanText("#_diff > span"),
                volume: cleanText("#_amount"),
                size: cleanText("#_sise_market_sum")
            };
            return stock;
        });
        console.log(stockResult)
        return stockResult;
    }
    catch (error) {
        Logger.error(error.message, error.stack)
    }

}


export const ipoInfo = async () => {
    try {
        const stockplusIpoLink = "https://m.stock.naver.com/api/stocks/ipo/scheduled?page=1&pageSize=20"
        const html = await axios.get(stockplusIpoLink)

        const ipoList: any = await html.data.ipoCoInfos

        const tobeOffer = ipoList.filter((stock: any) => {
            const poEndDate = parse(stock.poEndDate, "yyyyMMdd", new Date());
            const closingTime = addHours(poEndDate, 17);

            return isBefore(new Date(), closingTime);
        });

        const tobeListed = ipoList.filter((stock: any) => {
            const poEndDate = parse(stock.poEndDate, "yyyyMMdd", new Date());
            const closingTime = addHours(poEndDate, 17);

            return isAfter(new Date(), closingTime);
        });

        return {
            tobeOffer,
            tobeListed
        }
    }
    catch (e) {
        Logger.error(e)
    }

}


export const demandIpoInfo = async () => {
    try {
        const stockplusIpoLink = "https://m.stock.naver.com/api/stocks/ipo/underReview?page=1&pageSize=20"
        const html = await axios.get(stockplusIpoLink)

        const ipoList: any = await html.data.ipoCoInfos

        const tobeForecast = ipoList.filter((stock: any) => {
            return stock.poStatus === "P";
        })

        return {
            tobeForecast,
        }
    }
    catch (e) {
        Logger.error(e)
    }

}
