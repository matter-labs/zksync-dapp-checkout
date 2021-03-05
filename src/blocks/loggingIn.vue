<template>
  <transition name="fade">
    <div v-if="loggingIn || loggedInAnimation===true" class="loggingInContainer">
      <img class="zkSyncLogoFull h-24" src="/zkSyncLogoFull.svg" alt="zkSync">
      <h1 class="text-dark text-3xl">Logging in {{ selectedWallet ? `with ${selectedWallet}` : "" }}</h1>
      <transition-group tag="div" name="slide-vertical-fade" v-if="loadingHint" class="hint text-gray text-center text-sm mt-2">
        <div class="text-green" v-if="loggedInAnimation === true" key="loggedInAnimation">Wallet successfully connected!</div>
        <div v-else-if="loadingHint === 'followInstructions'" key="followInstructions">Follow the instructions in your wallet</div>
        <div v-else-if="loadingHint === 'loadingData'" key="loadingData">Getting wallet information</div>
      </transition-group>
      <div class="mt-5"></div>
      <loader size="md" />
      <defbtn class="cancelButton mt-6" @click="cancelLogin()">Cancel</defbtn>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";

let loggedInAnimationTimeout: ReturnType<typeof setTimeout>;
export default Vue.extend({
  data() {
    return {
      loggedInAnimation: false
    }
  },
  watch: {
    loggedIn(val) {
      clearTimeout(loggedInAnimationTimeout);
      if(val===false) {
        this.loggedInAnimation=false;
      }
      else if(val===true) {
        this.loggedInAnimation=true;
        loggedInAnimationTimeout = setTimeout(() => {
          this.loggedInAnimation=false;
        }, 550);
      }
    }
  },
  computed: {
    loggingIn: function (): boolean {
      return this.$store.getters["account/loader"];
    },
    loggedIn() {
      return this.$store.getters["account/loggedIn"];
    },
    selectedWallet: function (): string {
      return this.$store.getters["account/selectedWallet"];
    },
    loadingHint: function (): string {
      return this.$store.getters["account/loadingHint"];
    },
  },
  methods: {
    cancelLogin: function (): void {
      this.$store.dispatch("wallet/logout");
      this.$router.push("/connect");
      this.loggedInAnimation=false;
      clearTimeout(loggedInAnimationTimeout);
    },
  },
});
</script>
