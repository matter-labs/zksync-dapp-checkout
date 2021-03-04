<template>
  <div class="container">
    <div class="connectedWallet py-4 flex items-center">
      <i class="text-gray text-4xl mr-3 fal fa-wallet"></i>
      <values-block>
        <template slot="left-top">
          <div class="headline">My Wallet</div>
        </template>
        <template slot="left-bottom">
          <div class="address">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
        </template>
        <template slot="right-top">
          <defbtn>
            <span>Disconnect</span>
            <i class="far fa-power-off"></i>
          </defbtn>
        </template>
      </values-block>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
