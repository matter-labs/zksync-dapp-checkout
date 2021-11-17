<template>
  <transition name="fade">
    <div v-if="loggingIn && !loggingInScreenDelay" class="loggingInContainer">
      <block-logo class="h-16" />
      <h1 class="text-dark -dark text-3xl mt-3 text-center leading-tight">Logging in {{ selectedWallet ? `with ${selectedWallet}` : "" }}</h1>
      <transition-group tag="div" name="slide-vertical-fade" class="hint text-gray text-center text-sm mt-2">
        <div :key="hintText">{{ hintText }}</div>
      </transition-group>
      <div class="mt-5" />
      <zk-loader size="md" />
      <zk-defbtn class="cancelButton mt-6" @click="cancelLogin()"> Cancel </zk-defbtn>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";

let loggedInAnimationTimeout: ReturnType<typeof setTimeout>;
export default Vue.extend({
  name: "LoggingInLoader",
  data() {
    return {
      loggingInScreenDelay: false,
    };
  },
  computed: {
    loggingIn() {
      return this.$store.getters["zk-onboard/onboardStatus"] === "connecting" || this.$store.getters["zk-onboard/restoringSession"];
    },
    loggedIn() {
      return this.$store.getters["zk-onboard/onboardStatus"] === "authorized";
    },
    hintText(): string {
      return this.$store.getters["zk-onboard/loadingHint"];
    },
    selectedWallet() {
      return this.$store.getters["zk-onboard/selectedWallet"];
    },
  },
  watch: {
    loggingIn(val) {
      clearTimeout(loggedInAnimationTimeout);
      if (val === true) {
        this.loggingInScreenDelay = true;
        loggedInAnimationTimeout = setTimeout(() => {
          this.loggingInScreenDelay = false;
        }, 150);
      } else {
        this.loggingInScreenDelay = false;
      }
    },
  },
  methods: {
    cancelLogin() {
      this.$store.dispatch("zk-account/logout");
      this.$store.dispatch("checkout/setTransactionData", this.$store.getters["checkout/getTransactionData"]);
      this.$router.push("/connect");
    },
  },
});
</script>
