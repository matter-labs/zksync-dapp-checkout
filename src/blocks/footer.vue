<template>
  <footer class="zkFooterContainer flex justify-between items-center px-5 md:px-10">
    <div class="leftSide">
      <div class="text-violet text-sm -dark">
        Made with ❤️ by <a href="https://matter-labs.io" target="_blank" class="lightLink">Matter Labs</a>
      </div>
    </div>
    <div class="rightSide flex items-center">
      <block-system-info />
      <span class="linkDefault px-2">|</span>
      <a href="https://uptime.com/s/zksync" class="linkDefault" target="_blank">uptime</a>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from "vue";
import { GIT_REVISION_SHORT } from "@/plugins/build";

export default Vue.extend({
  data() {
    return {
      version: GIT_REVISION_SHORT,
    };
  },
});
</script>
