<template>
  <div class="defaultLayout min-h-screen">
    <modals />
    <div class="routerContainer bg-white2 md:min-h-screen py-4 md:py-10 px-5 md:px-10" />
  </div>
</template>

<script>
import modals from "@/blocks/modals.vue";

export default {
  components: {
    modals,
  },
  computed: {},
};
</script>
