<template>
  <div v-if="version" class="system-info flex items-stretch">
    <popover name="env-details" transition="show-from-bottom" :event="isMobile ? 'click' : 'hover'" :width="230"
             class="system-env-popover rounded-md bg-gray-500 flex-col justify-items-stretch p-5">
      <template slot="header">Environment details</template>
      <span class="flex">
          <i class="fab fa-npm mr-2" />
          zkSync <strong class=" ml-auto">v.{{ zkLibVersion }}</strong>
        </span>
      <span class="flex">
        <i class="fas fa-fingerprint mr-2" />
          Ethereum env: <strong class=" ml-auto">{{ netName }}</strong>
        </span>
      <span class="flex whitespace-no-wrap">
          <i class="fas fa-code mr-2" />
          API:&nbsp;<strong class="ml-auto text-xs">{{ zkApiBase.replace("https://", "") }}</strong>
        </span>
    </popover>
    <a id="system-b-popover" v-popover:env-details.top class="version">
      v.{{ version }}
    </a>

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
    isMobile(): boolean {
      return window.visualViewport.width < 768;
    },
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
    }
  }
});
</script>