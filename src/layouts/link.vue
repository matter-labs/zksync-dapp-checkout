<template>
  <div class="linkLayout min-h-screen w-full" :class="[{'darkMode': darkMode===true}]">
    <block-modals />
    <div class="routerContainer w-full h-full py-4 px-5 md:px-10">
      <block-logging-in/>
      <nuxt class="routeMain w-full h-full"/>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.getters["account/loggedIn"];
    },
    darkMode() {
      return this.$store.getters.darkMode;
    },
  },
};
</script>
