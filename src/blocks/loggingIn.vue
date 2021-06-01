<template>
  <transition name="fade">
    <div v-if="loggingIn || loggedInAnimation === true" class="loggingInContainer">
      <img class="zkSyncLogoFull h-24" src="/zkSyncLogoFull.svg" alt="zkSync" />
      <h1 class="text-dark text-3xl">Logging in {{ selectedWallet ? `with ${selectedWallet}` : "" }}</h1>
      <transition-group v-if="loadingHint" tag="div" name="slide-vertical-fade" class="hint text-gray text-center text-sm mt-2">
        <div v-if="loggedInAnimation === true" key="loggedInAnimation" class="text-green">Wallet successfully connected!</div>
        <div v-else-if="loadingHint === 'followInstructions'" key="followInstructions">Follow the instructions in your wallet</div>
        <div v-else-if="loadingHint === 'loadingData'" key="loadingData">Getting wallet information</div>
      </transition-group>
      <div class="mt-5" />
      <loader size="md" />
      <defbtn class="cancelButton mt-6" @click="cancelLogin()"> Cancel </defbtn>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";

let loggedInAnimationTimeout: ReturnType<typeof setTimeout>;
export default Vue.extend({
  data() {
    return {
      loggedInAnimation: false,
    };
  },
  computed: {
    loggingIn(): boolean {
      return this.$store.getters["account/loader"];
    },
    loggedIn():boolean {
      return this.$store.getters["account/loggedIn"];
    },
    selectedWallet(): string {
      return this.$store.getters["account/selectedWallet"];
    },
    loadingHint(): string {
      return this.$store.getters["account/loadingHint"];
    },
  },
  watch: {
    loggedIn(val):void {
      clearTimeout(loggedInAnimationTimeout);
      if (val === false) {
        this.loggedInAnimation = false;
      } else if (val === true) {
        this.loggedInAnimation = true;
        loggedInAnimationTimeout = setTimeout(() => {
          this.loggedInAnimation = false;
        }, 550);
      }
    },
  },
  methods: {
    cancelLogin(): void {
      this.$store.dispatch("wallet/logout");
      this.$router.push("/connect");
      this.loggedInAnimation = false;
      clearTimeout(loggedInAnimationTimeout);
    },
  },
});
</script>
