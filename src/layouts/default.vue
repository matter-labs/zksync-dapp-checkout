<template>
  <div class="defaultLayout min-h-screen" :class="{'darkMode': darkMode===true}">
    <modals />
    <info-block />
    <div class="routerContainer bg-white2 md:min-h-screen py-4 md:py-10 px-5 md:px-10">
      <logging-in/>
      <transition v-if="!loggingIn && (loggedIn || $route.path==='/connect' || $route.path==='/connect/')" name="fade" mode="out-in">
        <nuxt class="routeMain"/>
      </transition>
      <div class="zk-footer-space"></div>
      <zk-footer />
    </div>
  </div>
</template>

<script>
import infoBlock from "@/blocks/infoBlock.vue";
import loggingIn from "@/blocks/loggingIn.vue";
import modals from "@/blocks/modals.vue";
import zkFooter from "@/blocks/footer.vue";

export default {
  components: {
    infoBlock,
    loggingIn,
    modals,
    zkFooter,
  },
  computed: {
    loggingIn() {
      return this.$store.getters["account/loader"];
    },
    loggedIn() {
      return this.$store.getters["account/loggedIn"];
    },
    darkMode() {
      return this.$store.getters.darkMode;
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
  created() {
    let colorTheme = localStorage.getItem("colorTheme");
    if (!colorTheme) {
      colorTheme = "light";
    }
    if (colorTheme === "dark") {
      this.$store.commit("setDarkMode", true);
    }
    localStorage.setItem("colorTheme", colorTheme);
  },
};
</script>
