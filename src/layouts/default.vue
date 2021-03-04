<template>
  <div class="defaultLayout min-h-screen">
    <info-block/>
    <div class="routerContainer bg-white2 min-h-screen py-10 px-10">
      <transition mode="out-in" name="fade">
        <nuxt class="routeMain"/>
      </transition>
    </div>
  </div>
</template>

<script>
import infoBlock from "@/blocks/infoBlock.vue";

export default {
  components: {
    infoBlock,
  },
  computed: {},
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
