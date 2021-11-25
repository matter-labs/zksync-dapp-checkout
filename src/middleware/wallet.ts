import { Context, Middleware } from "@nuxt/types";
import useLinkHash from "@/plugins/useLinkHash";

const walletMiddleware: Middleware = (ctx: Context): Promise<void> | void => {
  // Case #1: Excluding linkBuilder
  if (ctx.route.path.startsWith("/link")) {
    return;
  }

  // Case #2: Processing an error
  if (ctx.store.getters["checkout/getErrorState"]) {
    console.log("router:", ctx.route);
    if ((ctx.route.path.startsWith("/connect") || ctx.route.path.match(/\/?/)) && typeof ctx.query.link === "string" && !ctx.store.getters["checkout/isLinkCheckout"]) {
      return useLinkHash(ctx, ctx.query.link as string);
    }
    return ctx.redirect("/link");
  }

  // Case #3: Restoring the session
  if (ctx.store.getters["zk-account/loggedIn"]) {
    if (ctx.route.path.startsWith("/connect")) {
      return ctx.redirect({ query: ctx.route.query, path: "/" });
    }
  } else {
    if (!ctx.route.path.startsWith("/connect") && !ctx.store.getters["zk-onboard/restoringSession"]) {
      ctx.redirect({ query: ctx.route.query, path: "/connect" });
    }
  }
};

export default walletMiddleware;