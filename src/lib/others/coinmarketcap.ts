import { Logger } from "@nestjs/common";
import axios from 'axios';

const tokenInfo = async (tokenTikcer: string) => {
  try {

    const API_KEY = process.env.COINMARKETCAP_API_TOKEN

    const comarketcapApiLink =
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=" +
      API_KEY +
      "&symbol=" +
      tokenTikcer;

    const html = await axios.get(comarketcapApiLink);

    var name = await html.data.data[tokenTikcer].name;
    var symbol = await html.data.data[tokenTikcer].symbol;
    var currentUsdPirce = await html.data.data[tokenTikcer].quote.USD.price;
    var changeRate = await html.data.data[
      tokenTikcer
    ].quote.USD.percent_change_24h.toFixed(2);
    var domi = await html.data.data[tokenTikcer].quote.USD.market_cap_dominance;

    return {
      name,
      symbol,
      currentUsdPirce,
      changeRate,
      domi
    };
  } catch (e) {
    Logger.error(e)
  }
};

export { tokenInfo };
