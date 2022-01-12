<template>
  <div v-if="displayed" :class="{ scrolledDown: scrolledDown }" class="scrollDownIcon" @click="scrollDown()">
    <i v-if="!scrolledDown" class="fas fa-chevron-down"></i>
    <i v-else class="fas fa-chevron-double-down"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scrolledDown: false,
      displayed: false,
    };
  },
  beforeDestroy() {
    this.$el?.parentElement?.removeEventListener("scroll", this.checkScrollHeight);
    window.removeEventListener("resize", this.checkScrollHeight);
  },
  mounted() {
    this.checkScrollHeight();
    this.$el?.parentElement?.addEventListener("scroll", this.checkScrollHeight);
    window.addEventListener("resize", this.checkScrollHeight);
  },
  methods: {
    getOffset() {
      const elHeight = this.$el.parentElement.getBoundingClientRect().height;
      return this.$el.parentElement.scrollHeight - elHeight - 15 - this.$el.parentElement.scrollTop;
    },
    checkScrollHeight() {
      if (!this.$el || !this.$el.parentElement) {
        return;
      }
      const elHeight = this.$el.parentElement.getBoundingClientRect().height;
      if (this.$el.parentElement.scrollHeight <= elHeight) {
        this.displayed = false;
        return;
      } else {
        this.displayed = true;
      }
      if (this.getOffset() > 0) {
        this.scrolledDown = false;
      } else {
        this.scrolledDown = true;
      }
    },
    scrollDown() {
      if (!this.$el || !this.$el.parentElement) {
        return;
      }
      if (this.getOffset() > 0) {
        const elHeight = this.$el.parentElement.getBoundingClientRect().height;
        this.$el.parentElement.scrollTop = this.$el.parentElement.scrollTop + elHeight / 2;
      } else {
        this.$el.parentElement.scrollTop = 0;
      }
    },
  },
};
</script>