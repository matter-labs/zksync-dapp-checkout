import { ZkSyncCheckoutManager } from "zksync-checkout-internal";
import { Context, Plugin } from "@nuxt/types";

const setCheckoutData: Plugin = async ({ app: { $accessor } }: Context): Promise<void> => {
  try {
    await $accessor.wallet.getProviders();
    const checkoutManager = ZkSyncCheckoutManager.getManager();
    checkoutManager.startCheckout((e) => console.log(`Err ${e} has occurred`));
    const state = await checkoutManager.getCheckoutState();
    console.log("Checkout state", state);
    await $accessor.checkout.setTransactionData({
      ...state,
      fromAddress: state.userAddress as string,
    });
    await $accessor.checkout.getTransactionBatchFee();
  } catch (error) {
    console.log("ZkSyncCheckoutManager error", error);
    await $accessor.checkout.setError(error);
  }
  await $accessor.tokens.loadAllTokens();

  let colorTheme = localStorage.getItem("colorTheme");
  if (!colorTheme) {
    colorTheme = "light";
  }
  if (colorTheme === "dark") {
    $accessor.setDarkMode(true);
  }
  localStorage.setItem("colorTheme", colorTheme);
};

export default setCheckoutData;