import Vue from "vue";
import utils from "@/plugins/utils";

import { Context, Plugin } from "@nuxt/types";
import moment from "moment";
import { ToastAction, ToastOptions } from "vue-toasted";
import { TokenSymbol } from "zksync/build/types";

// @ts-ignore
import { BigNumber } from "ethers";

// @ts-ignore
import Popover from "vue-js-popover";

// @ts-ignore
import VueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import { GweiBalance } from "@/types/lib";

/**
 * Special plugin to implement oh-awesome-icons into zkDapp
 * @param _ctx
 */
const mainPlugin: Plugin = (_ctx: Context): void => {
  Vue.use(Popover);
  Vue.component("VueCustomScrollbar", VueCustomScrollbar);

  /**
   * Implementation of the tokenFormatter as a global filter
   */
  Vue.filter("formatToken", (value: string | BigNumber | GweiBalance | ArrayLike<number> | bigint | number, symbol: TokenSymbol) => {
    return utils.handleFormatToken(symbol, value?.toString());
  });
  Vue.filter("formatTokenPretty", (value: GweiBalance | BigNumber, symbol: TokenSymbol) => {
    return utils.handleFormatTokenPretty(symbol, <string>value);
  });

  /**
   * Implementation of the tokenFormatter as a global filter
   */
  Vue.filter("formatUsdAmount", (value: string | BigNumber | GweiBalance, price: number, symbol: TokenSymbol) => {
    return utils.getFormattedTotalPrice(+price, +utils.handleFormatToken(symbol, <string>value));
  });

  /**
   * Format date as a human-readable "XX ago"
   */
  Vue.filter("formatTimeAgo", (time: moment.MomentInput) => moment(time).fromNow());

  /**
   * Filtering human-readable time
   */
  Vue.filter("getTimeString", (value: number) => {
    const { hours, minutes, seconds } = utils.timeCalc(value);
    return `${hours ? utils.handleTimeAmount(hours, "hour") : ""}
              ${minutes ? utils.handleTimeAmount(minutes, "minute") : ""}
              ${seconds ? utils.handleTimeAmount(seconds, "second") : ""}`;
  });

  /**
   * Format date as a human-readable "M/D/YYYY h:mm:ss A"
   */
  Vue.filter("formatDateTime", (time: moment.MomentInput) => moment(time).format("M/D/YYYY h:mm:ss A"));

  /**
   * Format date as a human-readable "M/D/YYYY h:mm:ss A"
   */
  Vue.filter("formatSeconds", (time: number) => utils.timeCalc(time));

  /**
   * Format transaction to a single format
   */
  Vue.filter("formatTxHash", (txHash: string) => {
    if (txHash.startsWith("sync-tx:")) {
      txHash = txHash.substr("sync-tx:".length, txHash.length);
    }
    if (!txHash.startsWith("0x")) {
      txHash = "0x" + txHash;
    }
    return txHash;
  });

  /**
   * zkException error reporting toaster registered
   * @uses vue-toasted npm-package
   */
  Vue.toasted.register(
    "zkException",
    (payload: { message?: string }): string => {
      return payload.message ?? "Oops...Something went wrong";
    },
    <ToastOptions>{
      duration: 4000,
      className: "zkToastException",
      icon: "fa-times-circle",
      type: "error",
    },
  );

  /**
   * zkCancel — first implementation of “push” with route action (on testing)
   * @uses vue-toasted npm-package
   */
  Vue.toasted.register(
    "zkCancel",
    (payload: { message?: string; hasCancelRoute: boolean; name?: string; route?: string }) => {
      return payload.message ?? "Cancel last operation";
    },
    <ToastOptions>{
      type: "info",
      duration: 2000,
      icon: "fa-undo",
      className: "zkToastInfo",
      action: [
        <ToastAction>{
          text: "Cancel",
          className: "zkToastActionCancel",
          push: {
            name: "/action",
            dontClose: true,
          },
        },
      ],
    },
  );
};

export default mainPlugin;