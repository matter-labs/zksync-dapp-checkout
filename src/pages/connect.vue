<template>
  <div class="connectContainer">
    <h1 class="font-bold text-center text-3xl my-2 text-dark">Connect to zkSync</h1>
    <div class="container flex h-auto flex-row connections items-center justify-center">
      <div
          data-cy="core_connect_wallet_button"
          class="tileContainer h-auto mr-10 text-center"
          @click="$accessor.provider.connectWithOnboard()"
      >
        <div class="tile">
          <img src="@/static/eth.svg" alt="External"/>
        </div>
        <div class="tileName">ETH connect</div>
      </div>

      <div
          data-cy="core_connect_wallet_button"
          class="tileContainer h-auto ml-10 text-center"
          @click="$accessor.provider.connectWithWalletConnect()"
      >
        <div class="tile">
          <img src="@/static/wc.png" alt="Wallet Connect"/>
        </div>
        <div class="tileName">Wallet Connect</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "connect",
  data() {
    return {
      lockVisible: false,
      contactInfoShown: false,
    };
  },
  mounted() {
    /**
     * @todo: fix stored in localStorage WalletConnect session somehow more elegant
     */
    localStorage.removeItem("walletconnect");
  }
});
</script>