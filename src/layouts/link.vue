<template>
  <div class="linkLayout min-h-screen">
    <block-modals />
    <div class="routerContainer w-full h-full px-0 md:px-10">
      <block-logging-in/>
      <nuxt class="routeMain w-full h-full"/>
    </div>
  </div>
</template>

<script>
import theme from "matter-dapp-module/utils/theme";
export default {
  computed: {
    loggedIn() {
      return this.$store.getters["zk-account/loggedIn"];
    },
  },
  mounted() {
    theme.setTheme("light");
  }
};
</script>
