import { Context, Middleware } from "@nuxt/types";

const wallet: Middleware = ({ redirect, app: { $accessor }, route }: Context) => {
  if (route.matched[0].path === "/link" || route.matched[0].path === "/link/:hash") {
    return;
  }
  if ($accessor.checkout.getErrorState) {
    redirect("/link");
    return;
  }
  if ($accessor.provider.loggedIn) {
    if (route.matched[0].path === "/connect") {
      redirect("/");
    }
    return;
  }
  if (route.fullPath !== "/") {
    if (!$accessor.provider.loggedIn) {
      redirect("/connect");
    }
  }
};

export default wallet;