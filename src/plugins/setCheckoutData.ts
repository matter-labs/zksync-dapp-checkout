import { ZkSyncCheckoutManager } from "zksync-checkout-internal";

export default async (context: any) => {
  const checkoutManager = ZkSyncCheckoutManager.getManager();
  const state = await checkoutManager.getCheckoutState();
  await context.store.commit("checkout/setTransactionData", {
    ...state,
    fromAddress: state.userAddress
  });
  await context.store.dispatch("wallet/getProviders");
  await context.store.dispatch("checkout/getTransactionBatchFee");
  await context.store.dispatch("tokens/loadAllTokens");
};
