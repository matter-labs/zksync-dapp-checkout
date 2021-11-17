import { Context } from "@nuxt/types";

export default ({ store, route, redirect }: Context) => {
  store.commit("zk-onboard/setLoginOptions", { requireSigner: true, requestTransactionHistory: false });
  if (route.matched[0].path === "/link" || route.matched[0].path === "/link/:hash") {
    return;
  }
  if (!route.path.startsWith("/connect")) {
    redirect("/connect");
  }
};
