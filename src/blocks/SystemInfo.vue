<template>
  <div v-if="version" class="system-info">
    <v-popover popover-class="system-env-popover" trigger="hover" :width="230" :placement="'top'">
      <div slot="popover" class="flex-col items-stretch p-2 text-xs">
        <div class="text-left text-sm mb-2">Environment details</div>
        <div class="flex flex-auto">
          zkSync: <strong class="ml-auto">v.{{ zkLibVersion }}</strong>
        </div>
        <div class="flex flex-auto">
          ETH: <strong class="ml-auto">{{ netName }}</strong>
        </div>
        <div class="flex flex-auto whitespace-nowrap">
          API:&nbsp;<strong class="ml-auto">{{ zkApiBase.replace("https://", "") }}</strong>
        </div>
      </div>
      <a class="version"> v.{{ version }} </a>
    </v-popover>

    <span class="mx-3 md:mx-2">|</span>
    <a :href="githubLink" class="revision lightLink" target="_blank">
      <i class="fab fa-github align-self-start" />
      {{ revision }}
    </a>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { ZkConfig } from "@matterlabs/zksync-nuxt-core/types";
import { GIT_REVISION_SHORT, VERSION, ZK_LIB_VERSION } from "@/plugins/build";

export default Vue.extend({
  computed: {
    config(): ZkConfig {
      return this.$store.getters["zk-onboard/config"];
    },
    netName(): string {
      return this.config.ethereumNetwork.name;
    },
    zkLibVersion(): string {
      return ZK_LIB_VERSION;
    },
    version(): string {
      return VERSION;
    },
    githubLink(): string | undefined {
      return `https://github.com/matter-labs/zksync-dapp-checkout/commit/${this.revision}`;
    },
    revision(): string {
      return GIT_REVISION_SHORT;
    },
    zkApiBase(): string {
      return this.config.zkSyncNetwork.api;
    },
  },
});
</script>
