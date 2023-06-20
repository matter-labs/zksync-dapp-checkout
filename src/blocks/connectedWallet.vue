<template>
  <div class="container">
    <div class="connectedWallet flex items-center">
      <i class="text-gray text-4xl mr-3 far fa-wallet" />
      <zk-values-block>
        <template slot="left-top">
          <a v-tooltip.bottom="`Open wallet`" target="_blank" :href="walletUrl" class="headline lightLink">
            My wallet
            <i style="position: relative; top: -1px" class="fas fa-external-link text-xs ml-1 text-dark2" />
          </a>
        </template>
        <template slot="left-bottom">
          <v-popover popover-class="copy-address">
            <div class="address" @click="copyAddress()">
              <span>
                <span>{{ ownAddress[0] }}</span
                ><span class="addressMiddle">{{ ownAddress[1] }}</span
              ><span class="dots">...</span><span>{{ ownAddress[2] }}</span>
              </span>
              <i class="copyIcon text-lg far fa-clipboard"></i>
            </div>
            <div slot="popover" class="text-center block text-xs p-1 px-3 mt-2">
              <span style="color: #7860df">Address copied!</span>
            </div>
          </v-popover>
        </template>
        <template slot="right-top">
          <div class="flex items-center flex-row">
            <buy-with-ramp-btn text="Top up with" class="mr-3" />
            <i v-tooltip.bottom="`Disconnect wallet`" class="far fa-power-off iconBtn text-lg" @click="logout()" />
          </div>
        </template>
      </zk-values-block>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Network } from "@rsksmart/rif-rollup-js-sdk/build/types";
import { copyToClipboard } from "@rsksmart/rif-rollup-nuxt-core/utils";

export default Vue.extend({
  computed: {
    ownAddress(): string[] {
      const address = this.$store.getters["zk-account/address"];
      if (!address) {
        return [];
      }
      return [address.substr(0, 11), address.substr(11, address.length - 5 - 11), address.substr(address.length - 5, address.length)];
    },
    network(): Network {
      return this.$store.getters["zk-provider/network"];
    },
    isProd(): boolean {
      return this.network === "mainnet";
    },
    walletUrl(): string {
      return `///wallet.zksync.io/${this.network !== "mainnet" ? "?network=" + this.network : ""}`;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("zk-account/logout");
      this.$store.dispatch("checkout/setTransactionData", this.$store.getters["checkout/getTransactionData"]);
      this.$router.push({ path: "/connect", query: this.$route.query });
    },
    copyAddress(): void {
      copyToClipboard(this.$store.getters["zk-account/address"]);
    },
    hide(): void {
      setTimeout(() => {
        if (this.$refs["copy-address"]) {
          (this.$refs["copy-address"] as HTMLElement).hidden = true;
        }
      }, 1500);
    },
  },
});
</script>
