<template>
  <div class="connectContainer">
    <div class="font-bold text-center text-3xl text-dark -dark">Connect to zkSync</div>
    <div class="tileContainer mx-auto mt-5" @click="customWallet()">
      <div class="tile">
        <img src="/tokens/eth.svg" alt="External" />
      </div>
      <div class="tileName">Connect your wallet</div>
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
  },
};
</script>
