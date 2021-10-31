<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";

import { parseDecimal } from "matter-dapp-module/utils";
import { RestProvider } from "zksync";
import { PaymentItem } from "@/types";
import { decrypt } from "@/plugins/link";

export default Vue.extend({
  layout: "link",
  async fetch({store, params, redirect}) {
    try {
      store.commit("checkout/setLinkCheckoutState", true);
      const syncProvider: RestProvider = await store.dispatch("zk-provider/requestProvider");
      await store.dispatch("zk-tokens/loadZkTokens");
      const transactions: PaymentItem[] = decrypt(params.hash);
      store.commit("checkout/setError", false);
      console.log("Transactions", transactions);
      store.dispatch("checkout/setTransactionData", {
        transactions: transactions.map((e, index) => ({
          to: e.address,
          token: e.token,
          amount: parseDecimal(syncProvider, e.token, e.amount.toString()),
          description: `Payment ${index+1}`,
        })),
        feeToken: "ETH",
        fromAddress: undefined,
      });
      store.dispatch("checkout/requestUsedTokensPrice");
      if(store.getters["zk-account/loggedIn"]) {
        await Promise.all([
          store.dispatch("checkout/requestInitialData"),
          store.dispatch("zk-account/updateAccountState", true),
        ]);
      }
      redirect("/connect");
    } catch (error) {
      console.log("zkLink error", error);
      await store.dispatch("openModal", "zkLinkParseFail");
      redirect("/link");
    }
  },
});
</script>
