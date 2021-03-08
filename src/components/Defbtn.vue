<template>
  <button v-if="!to" class="defbtn" :class="[outline===true?'outline':'filled']" v-on="$listeners">
    <slot/>
    <loader size="xs" :color="outline===true?'gray':'white'" v-if="loader" />
  </button>
  <nuxt-link :to="to" v-else class="defbtn" :class="[outline===true?'outline':'filled']" v-on="$listeners">
    <slot/>
    <loader size="xs" :color="outline===true?'gray':'white'" v-if="loader"/>
  </nuxt-link>
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
