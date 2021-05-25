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
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      maxHeight: 0,
      someValue: 0,
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0) as number,
    };
  },
  watch: {
    toggle: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.recalcHeight();
        });
      },
    },
    updateValue() {
      this.$nextTick(() => {
        this.recalcHeight();
      });
    },
  },
  mounted() {
    window.addEventListener("resize", this.recalcHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.recalcHeight);
  },
  methods: {
    recalcHeight() {
      this.maxHeight = this.$el.scrollHeight as number;
      this.screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) as number;
    },
  },
});
</script>