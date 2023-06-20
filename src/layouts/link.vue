<template>
  <div class="linkLayout min-h-screen">
    <block-modals />
    <block-wrong-network-modal />
    <block-onboard-error-modal />
    <div class="routerContainer w-full h-full px-0 md:px-10">
      <block-logging-in />
      <nuxt class="routeMain w-full h-full" />
    </div>
  </div>
</template>
