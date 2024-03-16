import { Logger } from '@nestjs/common';
import axios from 'axios';

const tokenInfo = async (tokenTicker: string) => {
  try {
    const bianceapiLink =
      "https://api.binance.com/api/v3/ticker?symbol=" +
      tokenTicker.toUpperCase() +
      "USDT";

    const html = await axios.get(bianceapiLink);

    const currentUsdPirce: number = Number(await html.data.lastPrice);
    const changeRate: number = Number(await html.data.priceChangePercent);
    const high_price: number = Number(await html.data.highPrice);
    const low_price: number = Number(await html.data.lowPrice);

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
