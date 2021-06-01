import { walletData } from "@/plugins/walletData";

export default (context) => {
  if (walletData.get().syncWallet) {
    if (context.route.matched[0].path === "/connect") {
      context.redirect("/");
    }
    return;
  }
  (async () => {
    const onboardResult = await context.store.dispatch("wallet/onboard");
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
