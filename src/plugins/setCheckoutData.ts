import { Context } from "@nuxt/types";
import { ZkSyncCheckoutManager } from "zksync-checkout-internal";
import theme from "@matterlabs/zksync-nuxt-core/utils/theme";

export default async ({ store }: Context): Promise<void> => {
  if (theme.getUserTheme() === "dark") {
    theme.toggleTheme();
  }
  await store.dispatch("zk-provider/requestProvider");
  await store.dispatch("zk-tokens/loadZkTokens");
  if (!window.opener || window.opener === window) {
    store.commit("checkout/setError", "Windows isn't a popup. Can't initialize zkCheckoutManager");
    return;
  }
  try {
    const checkoutManager = ZkSyncCheckoutManager.getManager();
    checkoutManager.startCheckout((e) => console.log(`Err ${e} has occurred`));
    const state = await checkoutManager.getCheckoutState();
    console.log("Checkout state", state);
    store.commit("checkout/setLinkCheckoutState", false);
    store.dispatch("checkout/setTransactionData", {
      ...state,
      fromAddress: state.userAddress,
    });
    // await store.dispatch("zk-transaction/setType", "TransferBatch", { root: true });
    store.dispatch("checkout/requestUsedTokensPrice");
  } catch (error) {
    console.log("ZkSyncCheckoutManager error", error);
    store.commit("checkout/setError", error);
  }
};
