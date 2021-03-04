<template>
  <div :class="{'hasIcon': $slots.icon}" class="noteContainer py-3 px-3 border border-light rounded-md">
    <div class="noteIcon pr-4">
      <slot name="icon"/>
    </div>
    <div class="noteBody">
      <slot/>
    </div>
  </div>
</template>
