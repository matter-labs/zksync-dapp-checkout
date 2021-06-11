<template>
  <div v-if="version" class="system-info flex flex-row mx-2">
    <a id="system-b-popover" v-popover:env-details.top class="linkDefault version px-2">v.{{ version
      }}<sup v-if="isBeta" class="beta text-danger ml-1 font-weight-bold">BETA</sup></a>
    <popover name="env-details" transition="show-from-bottom" event="hover" class="system-env-popover p-5 rounded-md bg-gray-500">
      <h2 class="w-full leading-5 text-left text-md bg-blue-400 px-2 py-1 font-light block">Environment details</h2>
      <div class="flex flex-col justify-items-stretch items-start text-left px-2">
        <span class="env-details text-xs font-light">
          <i class="fab fa-npm"/>
          zksync v.{{ zkLibVersion }}
        </span>
        <span class="env-details text-xs font-light gap-2">
          <i class="fad fa-code-branch"/>
          zkSync API <code class="py-0">{{ zkApiBase }}</code>
        </span>
        <span class="env-details text-xs font-light gap-2 flex">
          <i class="fad fa-code-branch"/>
          Ethereum env <code class="py-0">{{ netName }}</code>
        </span>
      </div>
    </popover>
      <a :href="githubLink" class="revision linkDefault x-2" target="_blank">
        <i class="fab fa-github align-self-start"/>
        {{ revision }}
      </a>
  </div>
</template>
<script lang="ts">
import { GIT_REVISION_SHORT, VERSION, ZK_API_BASE, ZK_IS_BETA, ZK_LIB_VERSION, ETHER_NETWORK_NAME } from "~/plugins/build";
import Vue from "vue";

export default Vue.extend({
  computed: {
    netName(): string {
      return ETHER_NETWORK_NAME;
    },
    isBeta(): boolean {
      return ZK_IS_BETA;
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
      return ZK_API_BASE;
    },
  },
});
</script>
