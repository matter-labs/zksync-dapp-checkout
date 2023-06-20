<template>
  <div class="defaultLayout min-h-screen">
    <block-modals />
    <div class="routerContainer bg-white2 md:min-h-screen py-4 md:py-10 px-5 md:px-10" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  watch: {
    $route: {
      immediate: true,
      handler(val, oldVal) {
        if (!oldVal) {
          this.$nextTick(() => {
            document.documentElement.scrollTop = 0;
          });
          return;
        }
        if (val.path !== oldVal.path) {
          this.$nextTick(() => {
            const lastScroll = this.$store.getters["scroll/getLastScroll"];
            document.documentElement.scrollTop = lastScroll !== false ? lastScroll.y : 0;
          });
        }
      },
    },
  },
  mounted() {
    window.history.scrollRestoration = "manual";
  },
});
</script>
