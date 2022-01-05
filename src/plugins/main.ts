import Vue from "vue";

// @ts-ignore
import Popover from "vue-js-popover";

import { VClosePopover, VPopover, VTooltip } from "v-tooltip";

// @ts-ignore
import VueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import { Context } from "@nuxt/types";

export default (_ctx: Context) => {
  Vue.directive("tooltip", VTooltip);
  Vue.directive("close-popover", VClosePopover);
  Vue.component("VPopover", VPopover);
  Vue.use(Popover);
  Vue.component("VueCustomScrollbar", VueCustomScrollbar);
};
