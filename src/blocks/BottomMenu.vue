<template>
  <div class="poweredBy flex justify-center mx-auto items-center mr-5">
    <a target="_blank" href="//zksync.io/legal/terms.html" class="linkDefault lightLink whitespace-nowrap mr-3">Our&nbsp;terms</a>
    <a target="_blank" href="//zksync.io/legal/privacy.html" class="linkDefault lightLink whitespace-nowrap mr-3">Privacy</a>
    <div v-show="!isLinkPage" class="linkDefault whitespace-nowrap mr-3 hidden md:block">
      <span class="dividerLine">|</span>
    </div>
    <nuxt-link v-show="!isLinkPage" class="linkDefault lightLink whitespace-nowrap mr-3" to="/link">Get&nbsp;your&nbsp;link</nuxt-link>
    <div class="linkDefault whitespace-nowrap mr-3 hidden md:block"><span class="dividerLine">|</span></div>
    <a target="_blank" :href="zkWalletLink" class="linkDefault lightLink whitespace-nowrap mr-3">zkWallet</a>
    <a target="_blank" :href="blockExplorerLink" class="linkDefault lightLink whitespace-nowrap">zkScan</a>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ETHER_NETWORK_NAME } from "~/plugins/build";

export default Vue.extend({
  computed: {
    isLinkPage(): boolean {
      return this.$route.path.startsWith("/link");
    },
    blockExplorerLink(): string {
      return this.$store.getters["zk-onboard/config"].zkSyncNetwork.explorer;
    },
    zkWalletLink(): string {
      return `//wallet.zksync.io?network=${ETHER_NETWORK_NAME}`;
    },
  },
});
</script>
