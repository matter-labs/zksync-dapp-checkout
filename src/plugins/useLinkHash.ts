import { Context } from "@nuxt/types";
import { parseDecimal } from "@matterlabs/zksync-nuxt-core/utils";
import { RestProvider } from "zksync";
import { ZKIPaymentItem } from "@/types";
import { decrypt } from "@/plugins/link";

export default async (ctx: Context, hash: string): Promise<void> => {
  try {
    ctx.store.commit("checkout/setLinkCheckoutState", true);
    const syncProvider: RestProvider = await ctx.store.dispatch("zk-provider/requestProvider");
    await ctx.store.dispatch("zk-tokens/loadZkTokens");
    const transactions: ZKIPaymentItem[] = decrypt(hash);
    ctx.store.commit("checkout/setError", false);
    ctx.store.dispatch("checkout/setTransactionData", {
      transactions: transactions.map((paymentItem, index) => ({
        to: paymentItem.address,
        token: paymentItem.token,
        amount: parseDecimal(syncProvider, paymentItem.token, paymentItem.amount.toString()),
        description: `Payment ${index + 1}`,
      })),
      feeToken: "ETH",
      fromAddress: undefined,
    });
    ctx.store.dispatch("checkout/requestUsedTokensPrice");
    if (ctx.store.getters["zk-account/loggedIn"]) {
      await Promise.all([ctx.store.dispatch("checkout/requestInitialData"), ctx.store.dispatch("zk-account/updateAccountState", true)]);
    }
    if (!ctx.route.path.startsWith("/connect")) {
      ctx.redirect({ path: "/connect", query: { link: hash } });
    }
  } catch (error) {
    console.log("zkLink error", error);
    await ctx.store.dispatch("openModal", "zkLinkParseFail");
    ctx.redirect("/link");
  }
};