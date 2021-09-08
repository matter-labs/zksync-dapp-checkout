import { Context, Middleware } from "@nuxt/types";

const wallet: Middleware = ({ redirect, app: { $accessor }, route, next }: Context) => {
  console.log(redirect, route, next);
  const ownRouter = route || next;
  if (!route) {
    return;
  }
  if (ownRouter!.matched[0]!.path === "/link" || ownRouter!.matched[0]!.path === "/link/:hash") {
    return;
  }
  if ($accessor.checkout.getErrorState) {
    redirect("/link");
    return;
  }
  if ($accessor.provider.loggedIn) {
    if (ownRouter!.fullPath === "/connect") {
      redirect("/");
    }
    return;
  }
  if (ownRouter!.fullPath === "/") {
    if (!$accessor.provider.loggedIn) {
      redirect("/connect");
    }
  }
};

export default wallet;