<template>
  <div class="container">
    <div class="connectedWallet flex items-center">
      <i class="text-violet text-4xl mr-3 fad fa-wallet"/>
      <values-block>
        <template slot="left-top">
          <div class="headline">My wallet</div>
        </template>
        <template slot="left-bottom">
          <div class="address">{{ownAddress}}</div>
        </template>
        <template slot="right-top">
          <div class="flex items-center flex-col md:flex-row">
            <defbtn outline class="mr-2 mb-2 md:mb-0" target="_blank" :to="walletUrl">
              <span>Open wallet</span>
              <i class="fas fa-external-link"/>
            </defbtn>
            <defbtn outline @click="logout()">
              <span class="text-red">Disconnect</span>
              <i class="text-red far fa-times"/>
            </defbtn>
          </div>
        </template>
      </values-block>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { Address } from "@/plugins/types";
import { ETHER_NETWORK_NAME } from "@/plugins/build";

export default Vue.extend({
  computed: {
    ownAddress(): Address {
      let address = this.$store.getters["account/address"];
      address = address.substr(0, 11) + "..." + address.substr(address.length - 5, address.length - 1);
      return address;
    },
    walletUrl(): string {
      return `///${ETHER_NETWORK_NAME === "rinkeby" ? "stage" : ETHER_NETWORK_NAME === "ropsten" ? "ropsten" : "wallet"}.zksync.io`;
    },
  },
  methods: {
    logout(): void {
      this.$store.dispatch("wallet/logout");
      this.$router.push("/");
    },
  },
});
</script>
