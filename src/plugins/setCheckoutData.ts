import { ZkSyncCheckoutManager } from "zksync-checkout-internal";
import { Context } from "@nuxt/types";
import { ZkSyncTransaction } from "zksync-checkout/build/types";
import { TokenSymbol } from "zksync/build/types";

export default async (context: Context): Promise<void> => {
  await context.app.$accessor.wallet.getProviders();
  try {
    const checkoutManager = ZkSyncCheckoutManager.getManager();
    checkoutManager.startCheckout((e) => console.log(`Err ${e} has occurred`));
    const state = await checkoutManager.getCheckoutState();

    /**
     * Hack to grab prices
     */
    const uniqueTokens: string[] = [];
    state.transactions.forEach((tx: ZkSyncTransaction) => {
      if (tx!.token && !uniqueTokens.includes(tx!.token)) {
        uniqueTokens.push(tx.token);
      }
    });

    uniqueTokens.forEach((symbol: TokenSymbol) => {
      context.app.$accessor.tokens.getTokenPrice(symbol);
    });

    console.log("Checkout state", state);
    await context.app.$accessor.checkout.setTransactionData({
      ...state,
      fromAddress: state.userAddress as string,
    });
    await context.app.$accessor.checkout.requestTransactionBatchFee();
  } catch (error) {
    console.log("ZkSyncCheckoutManager error", error);
    await context.app.$accessor.checkout.setError(error);
  }
  await context.app.$accessor.tokens.loadTokensAndBalances();

  let colorTheme = localStorage.getItem("colorTheme");
  if (!colorTheme) {
    colorTheme = "light";
  }
  if (colorTheme === "dark") {
    context.app.$accessor.setDarkMode(true);
  }
  localStorage.setItem("colorTheme", colorTheme);
};