import { Context, Middleware } from "@nuxt/types";
import useLinkHash from "@/plugins/useLinkHash";

const walletMiddleware: Middleware = (context: Context) => {
  if (context.route.matched[0].path === "/link" || context.route.matched[0].path === "/link/:hash") {
    return;
  }
  if (context.store.getters["checkout/getErrorState"]) {
    if((context.route.matched[0].path === "/connect" || context.route.matched[0].path === "") && typeof context.query.link === "string" && !context.store.getters["checkout/isLinkCheckout"]) {
      return useLinkHash(context, context.query.link);
    }
    context.redirect("/link");
    return;
  }
  if (context.store.getters["zk-account/loggedIn"]) {
    if (context.route.matched[0].path === "/connect") {
      context.redirect({query: context.route.query, path: "/"});
    }
    return;
  } else if (context.route.matched[0].path !== "/connect" && !context.store.getters["zk-onboard/restoringSession"]) {
    context.redirect({query: context.route.query, path: "/connect"});
  }
};

export default walletMiddleware;
