<template>
  <div class="container">
    <div class="connectedWallet flex items-center">
      <i class="text-gray text-4xl mr-3 far fa-wallet" />
      <popover name="copy-address" event="click" class="text-center block text-xs" :delay="100">
        Address copied!
      </popover>
      <zk-values-block>
        <template slot="left-top">
          <a target="_blank" :href="walletUrl" class="headline" v-tooltip.bottom="`Open wallet`">
            My wallet
            <i style="position: relative; top: -1px;" class="fas fa-external-link text-xs ml-1 text-dark2" />
          </a>
        </template>
        <template slot="left-bottom">
          <div @click="copyAddress()" id="copy-address" v-popover:copy-address.bottom class="address">
            <span>
              <span>{{ ownAddress[0] }}</span><span class="addressMiddle">{{ ownAddress[1] }}</span><span class="dots">...</span><span>{{ ownAddress[2] }}</span>
            </span>
            <i class="copyIcon text-lg far fa-clipboard"></i>
          </div>
        </template>
        <template slot="right-top">
          <div class="flex items-center flex-row">
            <buy-with-ramp-btn text="Top up with" class="mr-3" />
            <i v-tooltip.bottom="`Disconnect wallet`" @click="logout()" class="far fa-power-off iconBtn text-lg"></i>
          </div>
        </template>
      </zk-values-block>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Network } from "zksync/build/types";
import { copyToClipboard } from "matter-dapp-module/utils";

export default Vue.extend({
  computed: {
    ownAddress(): string[] {
      const address = this.$store.getters["zk-account/address"];
      if (!address) {return []}
      return [address.substr(0, 11), address.substr(11, address.length - 5 - 11), address.substr(address.length - 5, address.length)];
    },
    network(): Network {
      return this.$store.getters["zk-provider/network"];
    },
    isProd(): boolean {
      return this.network === "mainnet";
    },
    walletUrl(): string {
      return `///${this.isProd ? "wallet" : this.network }.zksync.io`;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("zk-account/logout");
      this.$store.dispatch("checkout/setTransactionData", this.$store.getters["checkout/getTransactionData"]);
    },
    copyAddress(): void {
      copyToClipboard(this.$store.getters["zk-account/address"]);
    }
  },
});
</script>
