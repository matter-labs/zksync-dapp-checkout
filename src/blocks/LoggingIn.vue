<template>
  <transition name="fade">
    <div v-if=" loggingIn || loggedInAnimation" class="loggingInContainer">
      <logo class="h-16" :is-zk-sync-logo="true" />
      <h1 class="text-dark -dark text-3xl mt-3 text-center leading-tight">Logging in {{ selectedWallet ? `with ${selectedWallet}` : "" }}</h1>
      <transition-group v-if="hintText" tag="div" name="slide-vertical-fade" class="hint text-gray text-center text-sm mt-2">
        <div v-if="!loggedInAnimation" :key="hintText">{{ hintText }}</div>
        <div v-else-if="loadingHint === 'processing'" key="processing">Processing...</div>
        <div v-else key="success" class="green">Wallet successfully connected!</div>
      </transition-group>
      <div class="mt-5" />
      <zk-loader size="md" />
      <zk-defbtn class="cancelButton mt-6" @click="cancelLogin">Cancel</zk-defbtn>
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
      eventSet: false,
      loggedInAnimation: false,
    };
  },
  computed: {
    isChecking(): boolean {
      return this.$accessor.provider.authStep === "isChecking";
    },
    loggedIn(): boolean {
      return this.$accessor.provider.loggedIn;
    },
    loggingIn(): boolean {
      return this.$accessor.provider.loader;
    },
    hintText(): string {
      if (this.$accessor.provider.loadingHint === "followInstructions") {
        return "Follow the instructions in your wallet";
      }
      if (this.$accessor.provider.loadingHint === "loadingData") {
        return "Getting wallet information";
      }
      return this.$accessor.provider.loadingHint;
    },
    selectedWallet(): string | undefined {
      return this.$accessor.provider.selectedWallet;
    },
  },
  watch: {
    loggedIn(val): void {
      clearTimeout(loggedInAnimationTimeout);
      this.loggedInAnimation = val;
      if (val === true) {
        loggedInAnimationTimeout = setTimeout(() => {
          this.loggedInAnimation = false;
          this.removeEventListener();
        }, 550);
      }
    },
    isChecking(val): void {
      if (this.loggingIn && val === true && !this.eventSet) {
        document.addEventListener("click", this.isCheckingClickHandler);
        this.eventSet = true;
      }
    },
  },
  methods: {
    isCheckingClickHandler(event: Event | undefined) {
      const targetHtmlElement: Element | null = event!.target as Element | null;
      if (this.$accessor.provider.authStep === "isChecking" && targetHtmlElement!.tagName.toLowerCase() === "aside" && targetHtmlElement!.classList!.contains("bn-onboard-modal")) {
        // @todo: improve this check
        if (confirm("Cancel wallet check?")) {
          this.$accessor.wallet.logout();
          this.removeEventListener();
        }
      }
    },
    removeEventListener() {
      document.removeEventListener("click", this.isCheckingClickHandler);
      this.eventSet = false;
    },
    cancelLogin(): void {
      this.$accessor.wallet.logout();
      this.loggedInAnimation = false;
      clearTimeout(loggedInAnimationTimeout);
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
  },
});
</script>