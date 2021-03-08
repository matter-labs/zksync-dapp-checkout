<template>
  <div class="lineTableHeader border-b border-light">
    <div class="tableItem"></div>
    <div class="tableItem font-bold hidden md:block"><slot name="first" /></div>
    <div class="tableItem font-light hidden md:block"><slot name="second" /></div>
    <div class="tableItem font-bold md:hidden"><slot name="first:md" /></div>
    <div class="tableItem font-light"><slot name="right" /></div>
  </div>
</template>
