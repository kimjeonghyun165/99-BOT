import { Logger } from '@nestjs/common';
import axios from 'axios';

const tokenInfo = async (tokenTicker: string) => {
  try {
    const bybitapiLink =
      "https://api.bybit.com/v5/market/tickers?category=inverse&symbol=" +
      tokenTicker.toUpperCase() +
      "USD";

    const html = await axios.get(bybitapiLink);



    const currentUsdPirce: number = Number(await html.data.result.list[0].lastPrice);
    const changeRate: number =
      (Number(await html.data.result.list[0].price24hPcnt) * 100);
    const high_price: number = Number(await html.data.result.list[0].highPrice24h);
    const low_price: number = Number(await html.data.result.list[0].lowPrice24h);

    return {
      currentUsdPirce,
      changeRate,
      high_price,
      low_price,
    }
  } catch (e) {
    Logger.error(e)
    return {
      currentUsdPirce: -1,
      changeRate: -1,
      high_price: -1,
      low_price: -1,
    }
  }
};

export { tokenInfo };
