import { ZkSyncCheckoutManager } from "zksync-checkout-internal";
import { Context } from "@nuxt/types";

export default async (context: Context): Promise<void> => {
  await context.store.dispatch("wallet/getProviders");
  try {
    const checkoutManager = ZkSyncCheckoutManager.getManager();
    checkoutManager.startCheckout((e) => console.log(`Err ${e} has occurred`));
    const state = await checkoutManager.getCheckoutState();
    console.log("Checkout state", state);
    await context.store.commit("checkout/setTransactionData", {
      ...state,
      fromAddress: state.userAddress,
    });
    await context.store.dispatch("checkout/getTransactionBatchFee");
  } catch (error) {
    console.log("ZkSyncCheckoutManager error", error);
    await context.store.dispatch("checkout/setError", error);
  }
  await context.store.dispatch("tokens/loadAllTokens");
  
  let colorTheme = localStorage.getItem("colorTheme");
  if (!colorTheme) {
    colorTheme = "light";
  }
  if (colorTheme === "dark") {
    context.store.commit("setDarkMode", true);
  }
  localStorage.setItem("colorTheme", colorTheme);
};
