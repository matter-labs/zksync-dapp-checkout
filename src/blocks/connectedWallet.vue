<template>
  <div class="container">
    <div class="connectedWallet flex items-center">
      <i class="text-gray text-4xl mr-3 far fa-wallet" />
      <values-block>
        <template slot="left-top">
          <div class="headline">My wallet</div>
        </template>
        <template slot="left-bottom">
          <div class="address">
            {{ ownAddress }}
          </div>
        </template>
        <template slot="right-top">
          <div class="flex items-center flex-col md:flex-row">
            <a class="mr-2 mb-2 md:mb-0 text-sm md:mr-4" target="_blank" :href="testnetWalletUrl">
              <span>Open wallet</span>
              <i class="fas fa-external-link" />
            </a>
            <defbtn outline @click="logout()">
              <span class="text-red">Disconnect</span>
              <i class="text-red far fa-times" />
            </defbtn>
          </div>
        </template>
      </values-block>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { Address } from "@/types";
import {ETHER_NETWORK_NAME, ETHER_PRODUCTION} from "@/plugins/build";

export default Vue.extend({
  computed: {
    ownAddress(): Address {
      const address = this.$store.getters["account/address"];
      return address.substr(0, 11) + "..." + address.substr(address.length - 5, address.length - 1);
    },
    isProd(): boolean {
      return ETHER_PRODUCTION;
    },
    testnetWalletUrl(): string {
      return `https://${this.isProd ? "wallet.zksync.io" : `${ETHER_NETWORK_NAME}.zksync.io`}`
    }
  },
  methods: {
    logout(): void {
      this.$store.dispatch("wallet/logout");
      this.$router.push("/connect");
    },
  },
});
</script>
