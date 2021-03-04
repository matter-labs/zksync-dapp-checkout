<template>
  <button :class="[outline===true?'outline':'filled']" class="defbtn">
    <slot/>
    <loader v-if="loader" color="gray" size="xs"/>
  </button>
</template>

<script>
export default {
  props: {
    outline: {
      default: false,
      type: Boolean,
      required: false,
    },
    loader: {
      default: false,
      type: Boolean,
      required: false,
    },
  },
};
</script>
