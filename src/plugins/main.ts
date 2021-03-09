import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import utils from "@/plugins/utils";
import Note from "@/components/Note.vue";
import Defbtn from "@/components/Defbtn.vue";
import Closebtn from "@/components/Closebtn.vue";
import LineBlock from "@/components/LineBlock.vue";
import TransactionToken from "@/components/TransactionToken.vue";
import SuccessMark from "@/components/SuccessMark.vue";
import Loader from "@/components/Loader.vue";
import AmountInput from "@/components/AmountInput.vue";
import ValuesBlock from "@/components/ValuesBlock.vue";
import Modal from "@/components/Modal.vue";
import MaxHeight from "@/components/MaxHeight.vue";

import { GweiBalance, TokenSymbol } from "@/plugins/types";
import { BigNumber } from "ethers";

import { ZkSyncCheckoutManager } from "zksync-checkout-internal";

const checkoutManager = ZkSyncCheckoutManager.getManager();
checkoutManager.startCheckout((e) => console.log(`Error ${e} has occurred`));

Vue.use(VueScrollTo);

Vue.component("Note", Note);
Vue.component("Defbtn", Defbtn);
Vue.component("Closebtn", Closebtn);
Vue.component("LineBlock", LineBlock);
Vue.component("TransactionToken", TransactionToken);
Vue.component("Loader", Loader);
Vue.component("AmountInput", AmountInput);
Vue.component("ValuesBlock", ValuesBlock);
Vue.component("Modal", Modal);
Vue.component("MaxHeight", MaxHeight);
Vue.component("SuccessMark", SuccessMark);

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
