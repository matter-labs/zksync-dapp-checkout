<template>
  <div class="valuesBlockContainer py-1" v-on="$listeners">
    <div class="valuesBlockLeft">
      <div v-if="$slots['left-top']" class="valuesBlockSecondary valuesLeftTop">
        <slot name="left-top" />
      </div>
      <div v-if="$slots['left-bottom']" class="valuesBlockSecondary valuesLeftBottom">
        <slot name="left-bottom" />
      </div>
    </div>
    <div class="valuesBlockRight">
      <div v-if="$slots['right-top']" class="valuesBlockSecondary valuesRightTop">
        <slot name="right-top" />
      </div>
      <div v-if="$slots['right-bottom']" class="valuesBlockSecondary valuesRightBottom">
        <slot name="right-bottom" />
      </div>
    </div>
  </div>
</template>
