<template>
  <div class="connectContainer">
    <div class="font-bold text-center text-2xl md:text-3xl text-dark">Connect with your Wallet</div>
    <div class="container flex h-auto flex-row flex-wrap connections items-center justify-center">
      <div data-cy="core_connect_wallet_button" class="tileContainer h-auto m-5 md:m-5 text-center" @click="customWallet()">
        <div class="tile">
          <img src="@/static/eth.svg" alt="External" />
        </div>
        <div class="tileName">ETH connect</div>
      </div>

      <div data-cy="wc_connect_wallet_button" class="tileContainer h-auto m-5 md:m-5 text-center" @click="walletConnect()">
        <div class="tile">
          <img src="@/static/wc.png" alt="Wallet Connect" />
        </div>
        <div class="tileName">Wallet Connect</div>
      </div>

      <div v-if="isMainnet" data-cy="argent_connect_wallet_button" class="tileContainer h-auto m-5 md:m-5 text-center" @click="argent()">
        <div class="tile">
          <img src="@/static/argent.svg" alt="Argent" />
        </div>
        <div class="tileName">Argent</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isMainnet() {
      return this.$store.getters["zk-provider/network"] === "mainnet";
    },
  },
  methods: {
    async customWallet() {
      const loginTry = await this.$store.dispatch("zk-onboard/loginWithOnboard");
      this.connect(loginTry);
    },
    async walletConnect() {
      const loginTry = await this.$store.dispatch("zk-onboard/loginWithWalletConnect");
      this.connect(loginTry);
    },
    async argent() {
      const loginTry = await this.$store.dispatch("zk-onboard/loginWithArgent");
      this.connect(loginTry);
    },
    async connect(loginTry) {
      if (!loginTry) {
        this.$store.dispatch("zk-account/logout");
        this.$store.dispatch("checkout/setTransactionData", this.$store.getters["checkout/getTransactionData"]);
      } else {
        this.$store.dispatch("checkout/requestInitialData");
        await this.$router.push({ query: this.$route.query, path: "/" });
      }
    },
  },
};
</script>
