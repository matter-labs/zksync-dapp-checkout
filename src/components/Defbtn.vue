<template>
  <button class="defbtn" :class="[outline===true?'outline':'filled']" v-on="$listeners">
    <slot/>
    <loader size="xs" color="gray" v-if="loader" />
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
    to: {
      default: "",
      type: String,
      required: false
    },
  },
};
</script>
