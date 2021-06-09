<template>
  <footer class="zkFooterContainer flex justify-between items-center px-5 md:px-10">
    <div class="leftSide">
      <div class="text-violet text-xs -dark">
        Made with ❤️ by Matter Labs
      </div>
    </div>
    <div class="rightSide flex items-center">
      <div v-if="version" class="version text-xs text-black2 -dark mr-3 md:mr-5">v.{{version}}</div>
      <div class="colorTheme" :class="{'dark': darkMode}" @click="toogleDarkMode">
        <i class="fas fa-adjust"></i>
      </div>
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
  computed: {
    darkMode() {
      return this.$store.getters.darkMode;
    },
  },
  methods: {
    toogleDarkMode() {
      this.$store.commit("setDarkMode", !this.darkMode);
      localStorage.setItem("colorTheme", this.darkMode ? "dark" : "light");
    },
  },
});
</script>
