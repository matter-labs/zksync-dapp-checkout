<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import { PaymentItem } from "@/types";
import { decrypt } from "@/plugins/link";
import utils from "@/plugins/utils";
import { ZkSyncTransaction } from "zksync-checkout-internal/src/types";
import { walletData } from "@/plugins/walletData";

export default Vue.extend({
  layout: "link",
  async fetch({store, params, redirect}) {
    try {
      const transactions: PaymentItem[] = decrypt(params.hash);
      await store.dispatch("checkout/setError", false);
      await store.commit("checkout/setTransactionData", {
        transactions: <ZkSyncTransaction[]>transactions.map((e, index) => ({
          to: e.address,
          token: e.token,
          amount: utils.parseToken(e.token, e.amount).toString(),
          description: `Payment ${index+1}`,
        })),
        feeToken: "ETH",
        fromAddress: undefined,
      });
      await store.dispatch("checkout/getTransactionBatchFee");
      await store.dispatch("tokens/loadAllTokens");
      if(walletData.get().syncWallet) {
        await store.dispatch("wallet/getzkBalances", { accountState: undefined, force: true });
        await store.dispatch("wallet/getInitialBalances", true);
        await store.dispatch("wallet/checkLockedState");
        await store.dispatch("checkout/getAccountUnlockFee");
      }
      await redirect("/connect");
    } catch (error) {
      console.log("zkLink error", error);
      await store.dispatch("openModal", "zkLinkParseFail");
      await redirect("/link");
    }
  },
});
</script>
