<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import useLinkHash from "@/plugins/useLinkHash";

export default Vue.extend({
  layout: "link",
  async fetch(ctx) {
    await useLinkHash(ctx, ctx.params.hash);
  },
});
</script>
