<template>
<div class="defaultLayout min-h-screen">
  <modals />
  <info-block />
  <div class="routerContainer bg-white2 md:min-h-screen py-4 md:py-10 px-5 md:px-10">
    <logging-in/>
    <transition v-if="!loggingIn && (loggedIn || $route.path==='/connect' || $route.path==='/connect/')" name="fade" mode="out-in">
      <nuxt class="routeMain"/>
    </transition>
  </div>
</div>
</template>

<script>
import infoBlock from "@/blocks/infoBlock.vue";
import loggingIn from "@/blocks/loggingIn.vue";
import modals from "@/blocks/modals.vue";

export default {
  components: {
    infoBlock,
    loggingIn,
    modals,
  },
  computed: {
    loggingIn() {
      return this.$store.getters["account/loader"];
    },
    loggedIn() {
      return this.$store.getters["account/loggedIn"];
    },
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
