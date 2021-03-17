<template>
  <div class="defaultLayout min-h-screen">
    <modals />
    <div class="routerContainer bg-white2 md:min-h-screen py-4 md:py-10 px-5 md:px-10"/>
  </div>
</template>

<script>
import modals from "@/blocks/modals.vue";

export default {
  components: {
    modals,
  },
  computed: {

  },
  watch: {
    $route: {
      immediate: true,
      handler(val, oldVal) {
        if (!oldVal) {
          return this.$nextTick(() => {
            document.documentElement.scrollTop = 0;
          });
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
    if (process.client) {
      window.history.scrollRestoration = "manual";
    }
  },
};
</script>
