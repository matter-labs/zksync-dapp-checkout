<template>
  <div class="container">
    <div class="connectedWallet py-4 flex items-center">
      <i class="text-gray text-4xl mr-3 fal fa-wallet"></i>
      <values-block>
        <template slot="left-top">
          <div class="headline">My Wallet</div>
        </template>
        <template slot="left-bottom">
          <div class="address">{{ownAddress}}</div>
        </template>
        <template slot="right-top">
          <defbtn @click="logout()">
            <span>Disconnect</span>
            <i class="far fa-power-off"></i>
          </defbtn>
        </template>
      </values-block>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  import { Address } from "@/plugins/types";

  export default Vue.extend({
  methods: {
  logout: function (): void {
  this.$store.dispatch("wallet/logout");
  this.$router.push("/connect");
},
},
  computed: {
  ownAddress: function (): Address {
  return this.$store.getters["account/address"];
},
}
});
</script>
