<template>
  <footer class="zkFooterContainer flex justify-between items-center pt-1 md:py-5">
    <block-bottom-menu v-if="fullFooterMenu"/>
    <div class="whitespace-no-wrap whitespace-nowrap" id="built-by-matterlabs">
      <span class="desktopOnly">Made with ❤️</span><a href="https://matter-labs.io" target="_blank" class="lightLink">by&nbsp;Matter&nbsp;Labs</a>
    </div>
    <div class="rightSide flex items-stretch">
      <block-system-info />
      <span class="mx-2 md:mx-2">|</span>
      <a href="https://uptime.com/s/zksync" class="lightLink" target="_blank">up<span class="desktopOnly">time</span></a>
    </div>
  </footer>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    fullFooterMenu: {
      type: Boolean,
      default: false,
      required: false
    }
  }
});
</script>