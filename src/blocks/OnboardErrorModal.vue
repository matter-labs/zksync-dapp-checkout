<template>
  <div class="allModalsContainer">
    <zk-modal v-model="opened">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
          <div>Onboarding error</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-left">
          {{ error }}
        </div>
      </template>
    </zk-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "WrongNetwork",
  computed: {
    error(): string {
      return this.$store.getters["zk-onboard/error"];
    },
    opened: {
      set(val): void {
        if (val === false) {
          this.$store.commit("zk-onboard/setError", "");
        }
      },
      get(): boolean {
        return !!this.$store.getters["zk-onboard/error"];
      },
    },
  },
});
</script>
