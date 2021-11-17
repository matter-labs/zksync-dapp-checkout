<template>
  <div class="defaultLayout min-h-screen" :class="[{'loggedIn': loggedIn===true && !$route.path.startsWith('/connect')},{'footerUpStyle': footerUpStyle===true}]">
    <block-modals />
    <block-info-block />
    <div class="routerContainer bg-white2 py-4 px-5 md:px-10">
      <block-logging-in/>
      <transition name="fade">
        <nuxt v-if="!loggingIn" @step="step=$event" class="routeMain"/>
      </transition>
      <block-footer />
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    address(val) {
      if(val && this.loggedIn) {
        this.$store.dispatch("checkout/setTransactionData", this.$store.getters["checkout/getTransactionData"]);
      }
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters["zk-account/loggedIn"];
    },
    address() {
      return this.$store.getters["zk-account/address"];
    },
    step() {
      return this.$store.getters["step"];
    },
    footerUpStyle() {
      return this.loggedIn===true && (this.step==='main' || this.step==='success');
    },
    loggingIn() {
      return this.$store.getters["zk-onboard/onboardStatus"] === "connecting" || this.$store.getters["zk-onboard/restoringSession"];
    },
  },
};
</script>