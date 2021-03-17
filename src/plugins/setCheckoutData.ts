import { ZkSyncCheckoutManager } from "zksync-checkout-internal";

export default async (context: any) => {
  try {
    const checkoutManager = ZkSyncCheckoutManager.getManager();
    checkoutManager.startCheckout((e) => console.log(`Err ${e} has occured`));
    const state = await checkoutManager.getCheckoutState();
    console.log("Checkout state", state);
    await context.store.commit("checkout/setTransactionData", {
      ...state,
      fromAddress: state.userAddress,
    });
    await context.store.dispatch("wallet/getProviders");
    await context.store.dispatch("checkout/getTransactionBatchFee");
    await context.store.dispatch("tokens/loadAllTokens");
  } catch (error) {
    console.log("Checkout error", error);
  }
};
