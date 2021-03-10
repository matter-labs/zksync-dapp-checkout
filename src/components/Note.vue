<template>
  <div class="noteContainer my-6">
    <div class="noteMain py-3 px-3 border border-light rounded-md"
         :class="{'hasIcon': $slots.icon}">
      <div class="noteIcon pr-4">
        <slot name="icon"/>
      </div>
      <div class="noteBody">
        <slot/>
      </div>
    </div>
  </div>
</template>
