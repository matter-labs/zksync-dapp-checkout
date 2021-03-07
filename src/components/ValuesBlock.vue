<template>
  <div class="valuesBlockContainer py-1" v-on="$listeners">
    <div class="valuesBlockLeft">
      <div class="valuesBlockSecondary valuesLeftTop" v-if="$slots['left-top']">
        <slot name="left-top"/>
      </div>
      <div class="valuesBlockSecondary valuesLeftBottom" v-if="$slots['left-bottom']">
        <slot name="left-bottom"/>
      </div>
    </div>
    <div class="valuesBlockRight">
      <div class="valuesBlockSecondary valuesRightTop" v-if="$slots['right-top']">
        <slot name="right-top"/>
      </div>
      <div class="valuesBlockSecondary valuesRightBottom" v-if="$slots['right-bottom']">
        <slot name="right-bottom"/>
      </div>
    </div>
  </div>
</template>
