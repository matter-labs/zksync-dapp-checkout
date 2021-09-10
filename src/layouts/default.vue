<template>
  <div class="defaultLayout min-h-screen" :class="[{'loggedIn': loggedIn===true},{'footerUpStyle': footerUpStyle===true}]">
    <modals />
    <info-block />
    <div class="routerContainer bg-white2 py-4 px-5 md:px-10">
      <logging-in/>
      <nuxt @step="step=$event" v-if="!loggingIn && (loggedIn || $route.path==='/connect' || $route.path==='/connect/')" class="routeMain"/>
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
    step() {
      return this.$store.getters["step"];
    },
    footerUpStyle() {
      return this.loggedIn===true && (this.step==='main' || this.step==='success');
    },
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
