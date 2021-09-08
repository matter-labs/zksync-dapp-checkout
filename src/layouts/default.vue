<template>
  <div class="defaultLayout min-h-screen" :class="layoutCssClass">
    <block-modals/>
    <block-info-block/>
    <div class="routerContainer bg-white2 py-4 px-5 md:px-10">
      <block-logging-in/>
      <nuxt @step="step=$event" v-if="!loggingIn && (loggedIn || $route.path==='/connect' || $route.path==='/connect/')" class="routeMain"/>
      <!-- <div class="zk-footer-space"></div> -->
      <block-footer/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {tProviderState} from "@/store/provider";

export default Vue.extend({
  computed: {
    layoutCssClass(): object[] {
      return [
        {"loggedIn": this.loggedIn},
        {"footerUpStyle": this.footerUpStyle}
      ]
    },
    step(): tProviderState {
      return this.$accessor.provider.authStep;
    },
    footerUpStyle(): boolean {
      return this.loggedIn && (this.step === 'ready' || this.step === 'authorized');
    },
    loggingIn(): boolean {
      return this.$accessor.provider.loader;
    },
    loggedIn(): boolean {
      return this.$accessor.provider.loggedIn;
    },
  },
});
</script>