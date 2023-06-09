import Vue from "vue";

// @ts-ignore
import Popover from "vue-js-popover";

// eslint-disable-next-line import/no-named-as-default
import VTooltip from "v-tooltip";

// @ts-ignore
import VueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import { Context } from "@nuxt/types";
import { UNSResolver } from "./uns";

export default (_ctx: Context) => {
  Vue.use(VTooltip);

  Vue.use(Popover);
  Vue.component("VueCustomScrollbar", VueCustomScrollbar);

  Vue.prototype.$domainResolver = new UNSResolver();
};
