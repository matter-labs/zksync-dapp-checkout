import { Context, Middleware } from "@nuxt/types";
import { Route } from "vue-router/types";

const auth: Middleware = ({ redirect, app: { $accessor, router }, route }: Context): Promise<void> | void => {
  console.log("router (context.app.router):", router);
  console.log("route (context.route):", route);

  const activeRoute: Route | ((err?: any) => void) = route || router;

  console.log("activeRoute:", activeRoute);

  if (activeRoute === undefined) {
    return;
  }

  /**
   * Auth case #1: Guest (non-limited) access to the ```/link/**``` section
   */
  if (activeRoute!.path!.includes("/link")) {
    return;
  }
  if ($accessor.checkout.getErrorState) {
    return redirect("/link");
  }

  /**
   * Auth case #2: Restrict guest access to the connect page
   */
  if ($accessor.provider.loggedIn && activeRoute.name === "connect") {
    return redirect("/");
  }

  if (!$accessor.provider.loggedIn && activeRoute.name !== "connect") {
    /**
     * Auth case #3: Authorized users after the successful connect should be directed back homepage
     */
    return redirect({ name: "connect" });
  }
};

export default auth;