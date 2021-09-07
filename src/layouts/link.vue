<template>
  <div class="linkLayout min-h-screen">
    <block-modals />
    <div class="routerContainer w-full h-full px-0 md:px-10">
      <block-logging-in/>
      <nuxt class="routeMain w-full h-full"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend( {
  computed: {
    loggedIn() {
      return this.$store.getters["account/loggedIn"];
    },
  },
});
</script>