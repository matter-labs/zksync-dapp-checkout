<template>
  <transition name="modal">
    <div class="modalContainer" :class="{'full': !block}" v-if="value" @click.self="close()">
      <div class="modalMain">
        <closebtn v-if="!block && notClosable===false" @click="close()"/>
        <div class="modalHeader" v-if="$slots['header']">
          <slot name="header"/>
        </div>
        <div class="modalBody" v-if="$slots['default']">
          <slot name="default"/>
        </div>
        <div class="modalFooter" v-if="$slots['footer']">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props:   {
    value:       {
      type: Boolean,
      default: false,
      required: false
    },
    block: {
      type: Boolean,
      default: false,
      required: false
    },
    notClosable: {
      type: Boolean,
      default: false,
      required: false
    },
  },
  methods: {
    close: function () {
      if (this.notClosable) {
        return
      }
      this.$emit('input', false);
      this.$emit('close');
    }
  },
});
</script>
