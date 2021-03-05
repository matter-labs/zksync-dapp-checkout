<template>
  <div class="maxHeightBlock" :style="{'height': `${value===true?maxHeight:0}px`}">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      maxHeight: 0,
    }
  },
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    toogle: {
      immediate: true,
      handler(val) {
        this.$nextTick(()=>{
          this.recalcHeight();
        });
      }
    }
  },
  methods: {
    recalcHeight: function() {
      this.maxHeight=this.$el.scrollHeight;
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
