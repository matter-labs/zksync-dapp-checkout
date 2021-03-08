<template>
  <div class="container">
    <div class="connectedWallet py-4 flex items-center">
      <i class="text-gray text-4xl mr-3 far fa-wallet"></i>
      <values-block>
        <template slot="left-top">
          <div class="headline">My Wallet</div>
        </template>
        <template slot="left-bottom">
          <div class="address">{{ownAddress}}</div>
        </template>
        <template slot="right-top">
          <div class="flex">
            <defbtn class="mr-2" target="_blank" to="///wallet.zksync.io">
              <span>zkWallet</span>
              <i class="far fa-external-link-alt"></i>
            </defbtn>
            <defbtn outline square @click="logout()">
              <i class="far fa-power-off"></i>
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

export default Vue.extend({
  computed: {
    ownAddress(): Address {
      let address = this.$store.getters["account/address"];
      address = address.substr(0, 11) + "..." + address.substr(address.length - 5, address.length - 1);
      return address;
    },
  },
  methods: {
    logout(): void {
      this.$store.dispatch("wallet/logout");
      this.$router.push("/connect");
    },
  },
});
</script>
