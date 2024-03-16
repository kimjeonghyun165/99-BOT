import { Logger } from '@nestjs/common';
import axios from 'axios';

const tokenInfo = async (tokenTicker: string) => {
  try {
    const mexcapiLink =
      "https://api.mexc.com/api/v3/ticker/24hr?symbol=" +
      tokenTicker.toUpperCase() +
      "USDT";

    const html = await axios.get(mexcapiLink);

    const currentUsdPirce: number = Number(await html.data.lastPrice);
    const changeRate: string = Number(await html.data.priceChangePercent).toFixed(2)
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
