import { Logger } from '@nestjs/common';
import axios from 'axios';

const tokenInfo = async (tokenTicker: string) => {
  try {
    const okxapiLink =
      "https://www.okx.com/api/v5/market/ticker?instId=" + tokenTicker.toUpperCase() + "-USDT"

    const html = await axios.get(okxapiLink);

    const currentUsdPirce: number = Number(
      await html.data.data[0].last
    );
    const changeRate: number =
      (Number(await html.data.data[0].last) / Number(await html.data.data[0].sodUtc0) - 1) * 100
    const high_price: number = Number(
      await html.data.data[0].high24h
    );
    const low_price: number = Number(
      await html.data.data[0].low24h
    );

    return {
      currentUsdPirce,
      changeRate,
      high_price,
      low_price,
    };
  } catch (e) {
    Logger.error(e)
    return {
      currentUsdPirce: -1,
      changeRate: -1,
      high_price: -1,
      low_price: -1,
    };
  }
};

export { tokenInfo };
