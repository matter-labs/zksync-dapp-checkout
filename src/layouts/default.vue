<template>
  <div class="defaultLayout min-h-screen" :class="[{'loggedIn': loggedIn===true && !$route.path.startsWith('/connect')},{'footerUpStyle': footerUpStyle===true}]">
    <block-modals />
    <block-info-block />
    <div class="routerContainer bg-white2 py-4 px-5 md:px-10">
      <transition name="fade">
        <div v-if="loggingIn && !loggingInScreenDelay" class="loggingInContainer">
          <block-logo class="h-16" />
          <h1 class="text-dark -dark text-3xl mt-3 text-center leading-tight">Logging in {{ selectedWallet ? `with ${selectedWallet}` : "" }}</h1>
          <transition-group tag="div" name="slide-vertical-fade" class="hint text-gray text-center text-sm mt-2">
            <div :key="hintText">{{ hintText }}</div>
          </transition-group>
          <div class="mt-5" />
          <zk-loader size="md" />
          <zk-defbtn class="cancelButton mt-6" @click="cancelLogin()">Cancel</zk-defbtn>
        </div>
      </transition>
      <transition name="fade">
        <nuxt v-if="!loggingIn" @step="step=$event" class="routeMain" />
      </transition>
      <block-wrong-network-modal />
      <block-footer />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  watch: {
    address(val) {
      if (val && this.loggedIn) {
        this.$store.dispatch("checkout/setTransactionData", this.$store.getters["checkout/getTransactionData"]);
      }
    },
    loggingIn(val) {
      if (this.loggedInAnimationTimeout) {
        clearTimeout(this.loggedInAnimationTimeout);
      }
      if (val===true) {
        this.loggingInScreenDelay = true;
        this.loggedInAnimationTimeout = setTimeout(() => {
          this.loggingInScreenDelay = false;
        }, 150);
      } else {
        this.loggingInScreenDelay = false;
      }
    },
  },
  computed: {
    address(): string {
      return this.$store.getters["zk-account/address"];
    },
    step(): string {
      return this.$store.getters["step"];
    },
    footerUpStyle(): boolean {
      return this.loggedIn && (this.step==='main' || this.step==='success');
    },
    loggingIn(): boolean {
      return this.$store.getters["zk-onboard/onboardStatus"]==="connecting" || this.$store.getters["zk-onboard/restoringSession"];
    },
    loggedIn(): boolean {
      return this.$store.getters["zk-onboard/onboardStatus"]==="authorized";
    },
    hintText(): string {
      return this.$store.getters["zk-onboard/loadingHint"];
    },
    selectedWallet():string | undefined {
      return this.$store.getters["zk-onboard/selectedWallet"];
    },
  },
  data() {
    return {
      loggingInScreenDelay: false,
      loggedInAnimationTimeout: <ReturnType<typeof setTimeout> | undefined>undefined,
    };
  },
  methods: {
    cancelLogin() {
      this.$store.dispatch("zk-account/logout");
      this.$store.dispatch("checkout/setTransactionData", this.$store.getters["checkout/getTransactionData"]);
      this.$router.push("/connect");
    },
  },
  beforeDestroy() {
    this.$store.dispatch("zk-onboard/walletConnectDisconnect");
  }
});
</script>