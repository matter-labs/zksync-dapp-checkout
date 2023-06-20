<template>
  <div class="defaultLayout min-h-screen" :class="[{ loggedIn: loggedIn === true && !$route.path.startsWith('/connect') }, { footerUpStyle: footerUpStyle === true }]">
    <block-modals />
    <block-info-block />
    <div class="routerContainer bg-white2 py-4 px-5 md:px-10">
      <block-logging-in />
      <transition name="fade">
        <nuxt v-if="!connecting" class="routeMain" @step="step = $event" />
      </transition>
      <block-wrong-network-modal />
      <block-onboard-error-modal />
      <block-footer />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  computed: {
    loggedIn(): boolean {
      return this.$store.getters["zk-onboard/onboardStatus"] === "authorized";
    },
    address(): string {
      return this.$store.getters["zk-account/address"];
    },
    step(): string {
      return this.$store.getters.step;
    },
    footerUpStyle(): boolean {
      return this.loggedIn && (this.step === "main" || this.step === "success");
    },
    connecting(): boolean {
      return this.$store.getters["zk-onboard/onboardStatus"] === "connecting" || this.$store.getters["zk-onboard/restoringSession"];
    },
  },
  watch: {
    address(val) {
      if (val && this.loggedIn) {
        this.$store.dispatch("checkout/setTransactionData", this.$store.getters["checkout/getTransactionData"]);
      }
    },
  },
});
</script>
