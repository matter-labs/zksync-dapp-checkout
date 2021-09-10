<template>
  <div class="connectContainer">
    <div class="font-bold text-center text-3xl text-dark -dark">Connect to zkSync</div>
    <div class="container flex h-auto flex-row connections items-center justify-center">
      <div
        data-cy="core_connect_wallet_button"
        class="tileContainer h-auto mr-10 text-center"
        @click="customWallet()"
      >
        <div class="tile">
          <img src="@/static/eth.svg" alt="External"/>
        </div>
        <div class="tileName">ETH connect</div>
      </div>
      <div
        data-cy="core_connect_wallet_button"
        class="tileContainer h-auto ml-10 text-center"
        @click="walletConnect()"
      >
        <div class="tile">
          <img src="@/static/wc.png" alt="Wallet Connect"/>
        </div>
        <div class="tileName">Wallet Connect</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async customWallet() {
      const onboard = this.$store.getters["wallet/getOnboard"];
      onboard.config({
        darkMode: false,
      });

      const refreshWalletTry = await this.$store.dispatch("wallet/walletRefresh");
      if (refreshWalletTry !== true) {
        await this.$store.dispatch("wallet/logout");
      } else {
        await this.$router.push("/");
      }
    },
    async walletConnect() {
      const refreshWalletTry = await this.$store.dispatch("wallet/connectWithWalletConnect");
      console.log("refreshWalletTry", refreshWalletTry);
      if (refreshWalletTry !== true) {
        await this.$store.dispatch("wallet/logout");
      } else {
        await this.$router.push("/");
      }
    },
  },
};
</script>
