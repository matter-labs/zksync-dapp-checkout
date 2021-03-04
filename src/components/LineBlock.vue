<template>
  <div class="lineContainer">
    <div class="lineItem">
      <slot name="first"/>
    </div>
    <div class="lineItem">
      <slot name="second"/>
    </div>
    <div class="lineItem">
      <slot name="third"/>
    </div>
    <div class="lineItem">
      <slot/>
    </div>
    <div class="lineItem">
      <slot name="right"/>
    </div>
  </div>
</template>
