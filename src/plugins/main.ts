import Vue from "vue";

// @ts-ignore
import Popover from "vue-js-popover";

// @ts-ignore
import VueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"

Vue.use(Popover);
Vue.component('VueCustomScrollbar', VueCustomScrollbar);