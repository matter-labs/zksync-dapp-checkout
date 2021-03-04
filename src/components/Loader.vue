<template>
  <div class="loaderSpinnerContainer">
    <div :class="[`size-${size}`,`color-${color}`]" class="loaderSpinner">Loading...</div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "md",
      required: false,
    },
    color: {
      type: String,
      default: "violet",
      required: false,
    },
  },
};
</script>
