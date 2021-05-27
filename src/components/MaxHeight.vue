<template>
  <div class="maxHeightBlock" :style="{ height: `${value === true || (mobileOnly === true && screenWidth > 768) ? maxHeight : 0}px` }">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
    mobileOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    updateValue: {
      required: false,
      default: false,
    },
  },
  data() {
    return {
      maxHeight: 0,
      someValue: 0,
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    };
  },
  watch: {
    updateValue(_val) {
      this.$nextTick(() => {
        this.reCalcHeight();
      });
    },
  },
  mounted() {
    window.addEventListener("resize", this.reCalcHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.reCalcHeight);
  },
  methods: {
    reCalcHeight() {
      this.maxHeight = this.$el.scrollHeight;
      this.screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    },
  },
});
</script>
