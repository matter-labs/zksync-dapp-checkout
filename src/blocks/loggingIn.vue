<template>
  <transition name="fade">
    <div v-if="showLoginContainer" class="loggingInContainer">
      <img class="zkSyncLogoFull h-24" src="/zkSyncLogoFull.svg" alt="zkSync" />
      <h1 class="text-dark text-2xl">Logging in {{ selectedWallet ? `with ${selectedWallet}` : "" }}</h1>
      <transition-group v-if="loadingHint" tag="div" name="slide-vertical-fade" class="hint text-gray text-center text-sm mt-2">
        <div key="{{hintKey}}" :class="{ 'text-green': loggedInAnimation }">
          {{ hintText }}
        </div>
      </transition-group>
      <div class="mt-5" />
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
      loggedInAnimation: false,
    };
  },
  computed: {
    showLoginContainer(): boolean {
      return this.loggingIn || this.loggedInAnimation;
    },
    loggingIn(): boolean {
      return this.$store.getters["account/loader"];
    },
    loggedIn() {
      return this.$store.getters["account/loggedIn"];
    },
    selectedWallet(): string {
      return this.$store.getters["account/selectedWallet"];
    },
    loadingHint(): string {
      return this.$store.getters["account/loadingHint"];
    },
    hintText(): string {
      if (this.loggedInAnimation) {
        return "Wallet successfully connected!";
      }
      if (this.loadingHint === "followInstructions") {
        return "Follow the instructions in your wallet";
      }
      if (this.loadingHint === "loadingData") {
        return "Getting the wallet information";
      }
      return "";
    },
    hintKey(): string {
      if (this.loggedInAnimation) {
        return "loggedInAnimation";
      }
      return this.loadingHint;
    },
  },
  watch: {
    loggedIn(val) {
      clearTimeout(loggedInAnimationTimeout);
      this.loggedInAnimation = val;
      if (val === true) {
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