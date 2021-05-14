import Vue from "vue";
import utils from "@/plugins/utils";

import { GweiBalance, TokenSymbol } from "@/plugins/types";
import { BigNumber } from "ethers";

/**
 * Implementation of the tokenFormatter as a global filter
 */
Vue.filter("formatToken", (value: GweiBalance | BigNumber, symbol: TokenSymbol) => {
  return utils.handleFormatToken(symbol, <string>value);
});
Vue.filter("formatTokenPretty", (value: GweiBalance | BigNumber, symbol: TokenSymbol) => {
  return utils.handleFormatTokenPretty(symbol, <string>value);
});

/**
 * Implementation of the tokenFormatter as a global filter
 */
Vue.filter("formatUsdAmount", (value: string | BigNumber, price: string, symbol: TokenSymbol) => {
  return utils.getFormattedTotalPrice(Number(price), +utils.handleFormatToken(symbol, value.toString()));
});

/**
 * Filtering human-readable time
 */
Vue.filter("getTimeString", (value: number) => {
  const { hours, minutes, seconds } = utils.timeCalc(value);
  return `${hours ? utils.handleTimeAmount(hours, "hour") : ""}
              ${minutes ? utils.handleTimeAmount(minutes, "minute") : ""}
              ${seconds ? utils.handleTimeAmount(seconds, "second") : ""}`;
});
