<template>
  <footer class="zkFooterContainer flex justify-between items-center px-5 md:px-10">
    <div class="leftSide">
      <div class="text-violet text-xs -dark">
        Made with ❤️ by Matter Labs
      </div>
    </div>
    <div class="rightSide flex items-center">
      <div v-if="version" class="version text-xs text-black2 -dark">v.{{version}}</div>
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
