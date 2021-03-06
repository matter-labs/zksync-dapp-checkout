<template>
  <div class="maxHeightBlock" :style="{'height': `${(value===true || (mobileOnly===true && screenWidth>768))?maxHeight:0}px`}">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      maxHeight: 0,
      someValue: 0,
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    }
  },
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },
    mobileOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    updateValue: {
      required: false,
      default: false
    },
  },
  watch: {
    toogle: {
      immediate: true,
      handler(val) {
        this.$nextTick(()=>{
          this.recalcHeight();
        });
      }
    },
    updateValue(val) {
      this.$nextTick(()=>{
        this.recalcHeight();
      });
    }
  },
  methods: {
    recalcHeight: function() {
      this.maxHeight = this.$el.scrollHeight;
      this.screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
  },
  mounted() {
    window.addEventListener("resize", this.recalcHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.recalcHeight);
  },
});
</script>
