<template>
  <div class="defaultLayout min-h-screen" :class="[{'loggedIn': loggedIn===true},{'footerUpStyle': footerUpStyle===true}]">
    <block-modals />
    <block-info-block />
    <div class="routerContainer bg-white2 py-4 px-5 md:px-10">
      <block-logging-in/>
      <nuxt @step="step=$event" v-if="!loggingIn && (loggedIn || $route.path==='/connect' || $route.path==='/connect/')" class="routeMain"/>
      <div class="zk-footer-space"></div>
      <block-footer class="px-5" />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    step() {
      return this.$store.getters["step"];
    },
    footerUpStyle() {
      return this.loggedIn===true && (this.step==='main' || this.step==='success');
    },
    loggingIn() {
      return this.$store.getters["account/loader"];
    },
    loggedIn() {
      return this.$store.getters["account/loggedIn"];
    },
  },
};
</script>
