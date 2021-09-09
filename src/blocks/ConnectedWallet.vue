<template>
  <div class="container">
    <div class="connectedWallet flex items-center">
      <i class="text-gray text-4xl mr-3 far fa-wallet" />
      <popover name="copy-address" event="click" class="text-center block text-xs" :delay="100">
        Address copied!
      </popover>
      <zk-values-block>
        <template slot="left-top">
          <div class="headline">My wallet</div>
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
          <div class="flex items-center flex-col md:flex-row">
            <zk-defbtn outline class="mr-2 mb-2 md:mb-0" target="_blank" :to="walletUrl">
              <span>Open wallet</span>
              <i class="fas fa-external-link" />
            </zk-defbtn>
            <zk-defbtn outline @click="logout">
              <span class="text-red">Disconnect</span>
              <i class="text-red far fa-times" />
            </zk-defbtn>
          </div>
        </template>
      </zk-values-block>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {ETHER_NETWORK_NAME, ETHER_PRODUCTION} from "@/plugins/build";
import {Address} from "zksync/build/types";
import utils from "@/plugins/utils";

export default Vue.extend({
  computed: {
    address(): Address | undefined {
      return this.$accessor.provider.address! as Address;
    },
    ownAddress(): string[] {
      return [this.address!.substr(0, 11), this.address!.substr(11, this.address!.length - 5 - 11), this.address!.substr(this.address!.length - 5, this.address!.length)];
    },
    isProd(): boolean {
      return ETHER_PRODUCTION;
    },
    walletUrl(): string {
      return `///${ETHER_PRODUCTION ? "wallet" : ETHER_NETWORK_NAME }.zksync.io`;
    },
  },
  methods: {
    logout(): void {
      this.$accessor.wallet.logout();
    },
    copyAddress(): void {
      if (this.address) {
        const copied = utils.copy(this.address)
      }
    }
  },
});
</script>