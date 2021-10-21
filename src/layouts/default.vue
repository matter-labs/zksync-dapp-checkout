<template>
  <div class="defaultLayout min-h-screen" :class="[{'loggedIn': loggedIn===true && $route.path!=='/connect'},{'footerUpStyle': footerUpStyle===true}]">
    <block-modals />
    <block-info-block />
    <div class="routerContainer bg-white2 py-4 px-5 md:px-10">
      <block-logging-in/>
      <nuxt @step="step=$event" class="routeMain"/>
      <block-footer />
    </div>
  </div>
</template>

<script>
import theme from "matter-dapp-module/utils/theme";
export default {
  computed: {
    step() {
      return this.$store.getters["step"];
    },
    footerUpStyle() {
      return this.loggedIn===true && (this.step==='main' || this.step==='success');
    },
    loggingIn() {
      return this.$store.getters["zk-onboard/onboardStatus"] === "connecting" || this.$store.getters["zk-onboard/restoringSession"];
    },
    loggedIn() {
      return this.$store.getters["zk-onboard/onboardStatus"] === "authorized";
    },
  },
  mounted() {
    theme.setTheme("light");
  }
};
</script>
