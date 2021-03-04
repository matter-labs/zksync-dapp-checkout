<template>
  <aside class="infoBlockContainer bg-white h-screen">
    <div class="infoBlock min-h-screen py-10 px-10">
      <div class="text-violet text-2xl font-bold">Checkout</div>
      <note class="mt-7">
        <template slot="icon">
          <i class="text-gray fal fa-comment-alt-exclamation"></i>
        </template>
        <template slot="default">
          <div class="text-dark2 font-light text-sm">By using zkSync: Checkout Gateway, you agree to accept full responsability. See our <a class="lightLink"
                                                                                                                                            href="https://zksync.io/legal/terms.html#overview"
                                                                                                                                            target="_blank">Terms of Service</a> and
            <a class="lightLink" href="https://zksync.io/legal/privacy.html#introduction" target="_blank">Privacy Policy</a> for the details.
          </div>
        </template>
      </note>
      <values-block class="mt-10">
        <template slot="left-top">
          <div class="headline">Gitcoin Bounty</div>
        </template>
        <template slot="left-bottom">
          <div class="address">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
        </template>
        <template slot="right-top">
          <div class="value">15,13 LINK</div>
        </template>
        <template slot="right-bottom">
          <div class="secondaryValue">2,31 $</div>
        </template>
      </values-block>
      <values-block class="mt-3">
        <template slot="left-top">
          <div class="headline">Paid Extras: featured placement</div>
        </template>
        <template slot="left-bottom">
          <div class="address">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
        </template>
        <template slot="right-top">
          <div class="value">0,00013 BTC</div>
        </template>
        <template slot="right-bottom">
          <div class="secondaryValue">2,31 $</div>
        </template>
      </values-block>
      <div class="w-full border-b-2 border-light mt-3"></div>
      <values-block class="mt-3">
        <template slot="left-top">
          <div class="headline big">Fees</div>
        </template>
        <template slot="right-top">
          <div class="value big">0,013 ETH</div>
        </template>
        <template slot="right-bottom">
          <div class="secondaryValue font-medium">5,61 $</div>
        </template>
      </values-block>
      <values-block class="mt-3">
        <template slot="left-top">
          <div class="headline">3rd Party / GitCoin</div>
        </template>
        <template slot="left-bottom">
          <div class="address">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
        </template>
        <template slot="right-top">
          <div class="value">0,01 ETH</div>
        </template>
        <template slot="right-bottom">
          <div class="secondaryValue">5,44 $</div>
        </template>
      </values-block>
      <values-block class="mt-3">
        <template slot="left-top">
          <div class="headline">Tx Batch Fee / zkSync</div>
        </template>
        <template slot="left-bottom">
          <div class="address">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
        </template>
        <template slot="right-top">
          <div class="value">0,0003 ETH</div>
        </template>
        <template slot="right-bottom">
          <div class="secondaryValue">0,16 $</div>
        </template>
      </values-block>
      <div class="w-full border-b-2 border-light mt-3"></div>
      <div class="mt-4 flex">
        <div class="flex-2">
          <div class="font-firaCondensed font-bold text-2xl text-dark">Total amount</div>
        </div>
        <div class="flex-1 flex flex-col items-end">
          <div class="font-firaCondensed font-bold text-lg text-violet mt-1">205,32 USD</div>
          <div class="font-firaCondensed font-bold text-xs text-black2 mt-2">0,0103 ETH</div>
          <div class="font-firaCondensed font-bold text-xs text-black2 mt-2">0,000103 BTC</div>
          <div class="font-firaCondensed font-bold text-xs text-black2 mt-2">15,13 LINK</div>
        </div>
      </div>
      <div class="footerContainer">
        <footer>
          <div class="poweredBy flex justify-center items-center pt-5">
            <div class="text-lg font-firaCondensed font-medium uppercase text-violet mr-3">Powered by</div>
            <img alt="" class="zkSyncLogoFull h-12" src="/zkSyncLogoFull.svg">
          </div>
          <div class="poweredBy flex justify-center items-center mt-3">
            <a class="linkDefault" href="https://zksync.io/legal/terms.html#overview" target="_blank">Terms of Service</a>
            <a class="linkDefault ml-5" href="https://zksync.io/legal/privacy.html#introduction" target="_blank">Privacy Policy</a>
          </div>
        </footer>
        <img alt="" class="zkSyncFooter" src="/zkSyncFooter.svg">
      </div>
    </div>
  </aside>
</template>

<script>
export default {};
</script>
