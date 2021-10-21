import { Context, Middleware } from "@nuxt/types";

const walletMiddleware: Middleware = (context: Context) => {
  if (context.route.matched[0].path === "/link" || context.route.matched[0].path === "/link/:hash") {
    return;
  }
  if (context.store.getters["checkout/getErrorState"]) {
    context.redirect("/link");
    return;
  }
  if (context.store.getters["zk-account/loggedIn"]) {
    if (context.route.matched[0].path === "/connect") {
      context.redirect("/");
    }
    return;
  } else if (context.route.matched[0].path !== "/connect" && !context.store.getters["zk-onboard/restoringSession"]) {
    context.redirect("/connect");
  }
};

export default walletMiddleware;
