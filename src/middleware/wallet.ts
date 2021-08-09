import { walletData } from "@/plugins/walletData";
import { Context, Middleware } from "@nuxt/types";

const walletMiddleware: Middleware = (context: Context) => {
  if (context.route.matched[0].path === "/link" || context.route.matched[0].path === "/link/:hash") {
    return;
  }
  if (context.store.getters["checkout/getErrorState"]) {
    context.redirect("/link");
    return;
  }
  if (walletData.get().syncWallet) {
    if (context.route.matched[0].path === "/connect") {
      context.redirect("/");
    }
    return;
  }
  (async () => {
    const onboardResult = await context.store?.dispatch("wallet/onboard");
    if (onboardResult !== true) {
      await context.store.dispatch("wallet/logout");
      if (context.route.matched[0].path !== "/connect") {
        context.redirect("/connect");
      }
      return;
    }

    const refreshWallet = await context.store.dispatch("wallet/walletRefresh");
    if (refreshWallet !== true) {
      await context.store.dispatch("wallet/logout");
      if (context.route.matched[0].path !== "/connect") {
        context.redirect("/connect");
      }
    } else if (context.route.matched[0].path === "/connect") {
      context.redirect("/");
    }
  })();
};

export default walletMiddleware;
