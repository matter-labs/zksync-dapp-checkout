<template>
  <div class="linkLayout min-h-screen w-full">
    <block-modals />
    <div class="routerContainer w-full h-full px-5 md:px-10">
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
  },
};
</script>
