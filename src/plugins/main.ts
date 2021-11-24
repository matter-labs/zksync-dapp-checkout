import Vue from "vue";

// @ts-ignore
import Popover from "vue-js-popover";

import VTooltip from "v-tooltip";

// @ts-ignore
import VueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import { Context } from "@nuxt/types";

export default (_ctx: Context) => {
  Vue.use(VTooltip);
  Vue.use(Popover);
  Vue.component("VueCustomScrollbar", VueCustomScrollbar);
};