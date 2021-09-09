<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import { PaymentItem } from "@/types/lib.d";
import { decrypt } from "@/plugins/link";
import utils from "@/plugins/utils";
import { ZkSyncTransaction } from "zksync-checkout-internal/src/types";
import { walletData } from "@/plugins/walletData";
import {Address} from "zksync/build/types";

export default Vue.extend({
  layout: "link",
  async fetch({store, params, redirect}) {
    try {
      const transactions: PaymentItem[] = decrypt(params.hash);
      console.log(this, "this");
      await store.dispatch("checkout/setError", undefined);
      store.commit("checkout/setTransactionData", {
        transactions: <ZkSyncTransaction[]>transactions.map((e: PaymentItem, index) => ({
          to: e.address,
          token: e.token,
          amount: utils.parseToken(e.token, e.amount).toString(),
          description: `Payment`,
        })),
        feeToken: "ETH",
        fromAddress: "" as Address,
      });
      await store.dispatch("checkout/requestTransactionBatchFee");
      await store.dispatch("tokens/loadAllTokens");
      if(walletData.get().syncWallet) {
        await store.dispatch("wallet/getzkBalances", { accountState: undefined, force: true });
        await store.dispatch("wallet/getInitialBalances", true);
        await store.dispatch("wallet/checkLockedState");
        await store.dispatch("checkout/getAccountUnlockFee");
      }
      return redirect("/connect");
    } catch (error) {
      console.log("zkLink error", error);
      await store.dispatch("openModal", "zkLinkParseFail");
      return redirect("/link");
    }
  },
});
</script>