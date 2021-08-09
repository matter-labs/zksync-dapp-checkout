<template>
  <div v-if="version" class="system-info flex items-stretch">
    <popover name="env-details" transition="show-from-bottom" event="hover" :width="200"
             class="system-env-popover rounded-md bg-gray-500 flex-col justify-items-stretch p-5">
      <span class="flex">
          <i class="fab fa-npm mr-2"/>
          zkSync.js: <strong class=" ml-auto">v.{{ zkLibVersion }}</strong>
        </span>
      <span class="flex">
          <i class="fad fa-code-branch mr-2"/>
          Network: <strong class=" ml-auto">{{ netName }}</strong>
        </span>
      <span class="flex whitespace-no-wrap">
          <i class="fad fa-code-branch mr-2"/>
          API: <strong class="ml-auto">{{ zkApiBase }}</strong>
        </span>
    </popover>
    <a id="system-b-popover" v-popover:env-details.top class="version">
      v.{{ version }}
    </a>

    <span class="mx-3 md:mx-2">|</span>
    <a :href="githubLink" class="revision lightLink" target="_blank">
      <i class="fab fa-github align-self-start"/>
      {{ revision }}
    </a>
  </div>
</template>
<script lang="ts">
import {ETHER_NETWORK_NAME, GIT_REVISION_SHORT, VERSION, ZK_API_BASE, ZK_IS_BETA, ZK_LIB_VERSION} from "~/plugins/build";
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
