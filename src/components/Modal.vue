<template>
  <transition name="modal">
    <div v-if="value" class="modalContainer" :class="{'full': !block}" @click.self="$emit('input', false)">
      <div class="modalMain">
        <closebtn v-if="!block" @click="$emit('input', false)" />
        <div v-if="$slots['header']" class="modalHeader">
          <slot name="header" />
        </div>
        <div v-if="$slots['default']" class="modalBody">
          <slot name="default" />
        </div>
        <div v-if="$slots['footer']" class="modalFooter">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
      required: false,
    },
    block: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
});
</script>
