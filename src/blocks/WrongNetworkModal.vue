<template>
  <div class="allModalsContainer">
    <zk-modal v-model="opened">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
          <div>Wrong network</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-left">
          <div class="pb-1">
            You are on the wrong network.<br />Please switch your wallet to <b>{{ network }}</b> to continue.
          </div>
          <div class="pb-1 text-sm">
            Some wallets may not support changing networks. If you can not change networks in your wallet you may
            consider switching to a different wallet.
          </div>
        </div>
      </template>
    </zk-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ZkConfig } from "@matterlabs/zksync-nuxt-core/types";

export default Vue.extend({
  name: "WrongNetwork",
  computed: {
    network(): string {
      return (<ZkConfig>this.$store.getters["zk-onboard/config"]).ethereumNetwork.name;
    },
    opened: {
      set(val): void {
        if (val === false) {
          this.$store.dispatch("zk-onboard/rejectNetworkChange");
        }
      },
      get(): boolean {
        return this.$store.getters["zk-onboard/wrongNetwork"];
      },
    },
  },
});
</script>
