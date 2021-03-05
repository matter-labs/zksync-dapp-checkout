<template>
  <aside class="infoBlockContainer bg-white h-screen">

    <modal v-model="modal">
      <template slot="header">
        <div class="withIcon">
          <i class="text-gray fad fa-comment-alt-exclamation"></i>
          <div class="text-xl">Information</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-dark2 font-light">By using zkSync: Checkout Gateway, you agree to accept full responsibility. See our <a class="lightLink" target="_blank" href="https://zksync.io/legal/terms.html#overview">Terms of Service</a> and <a class="lightLink" target="_blank" href="https://zksync.io/legal/privacy.html#introduction">Privacy Policy</a> for the details.</div>
      </template>
      <!-- <template slot="footer">
        <div class="flex justify-center">
          <defbtn outline class="mr-2" @click="modal=false">
            <i class="far fa-arrow-left"></i>
            <span>Cancel and return</span>
          </defbtn>
        </div>
      </template> -->
    </modal>

    <div class="infoBlock md:min-h-screen py-4 md:py-10 px-5 md:px-10">
      <header>
        <span class="mobileOnly" @click="modal=true">
          <i class="far fa-arrow-left"></i>
        </span>
        <div class="flex items-center">
          <img class="w-10 h-10 mr-2" src="/zkSyncLogo.svg" alt="zkSync">
          <div class="text-violet text-2xl font-bold">Checkout</div>
        </div>
        <strong class="mobileOnly" @click="modal=true">
          <i class="fal fa-shield-check"></i>
        </strong>
      </header>
      <note class="hidden md:block mt-3 lg:mt-7">
        <template slot="icon">
          <i class="text-gray text-base lg:text-lg fal fa-comment-alt-exclamation"></i>
        </template>
        <template slot="default">
          <div class="text-dark2 font-light text-xs lg:text-sm">By using zkSync: Checkout Gateway, you agree to accept full responsibility. See our <a class="lightLink" target="_blank" href="https://zksync.io/legal/terms.html#overview">Terms of Service</a> and <a class="lightLink" target="_blank" href="https://zksync.io/legal/privacy.html#introduction">Privacy Policy</a> for the details.</div>
        </template>
      </note>
      <values-block class="mt-3 lg:mt-10">
        <template slot="left-top">
          <div class="headline">Gitcoin Bounty</div>
        </template>
        <template slot="left-bottom">
          <div class="address hidden lg:block">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
        </template>
        <template slot="right-top">
          <div class="flex md:flex-col whitespace-nowrap">
            <div class="value mr-2 md:mr-0">15.13 LINK</div>
            <div class="secondaryValue">2.31 $</div>
          </div>
        </template>
      </values-block>
      <values-block class="mt-1 lg:mt-3">
        <template slot="left-top">
          <div class="headline">Paid Extras: featured placement</div>
        </template>
        <template slot="left-bottom">
          <div class="address hidden lg:block">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
        </template>
        <template slot="right-top">
          <div class="flex md:flex-col whitespace-nowrap">
            <div class="value mr-2 md:mr-0">0.00013 BTC</div>
            <div class="secondaryValue">12.31 $</div>
          </div>
        </template>
      </values-block>
      <div class="w-full border-b-2 border-light mt-1 lg:mt-3"></div>
      <values-block class="mt-1 lg:mt-3">
        <template slot="left-top">
          <div class="headline big">Fees</div>
        </template>
        <template slot="right-top">
          <div class="flex items-center">
            <div class="flex md:flex-col mr-3">
              <div class="value mr-2 md:mr-0">0.01 ETH</div>
              <div class="secondaryValue">5.44 $</div>
            </div>
            <span @click="feesOpened=!feesOpened">
              <i class="transition-transform ease transition-200 far fa-angle-down" :style="{'transform': `rotate(${feesOpened===true?-180:0}deg)`}"></i>
            </span>
          </div>
        </template>
      </values-block>
      <max-height v-model="feesOpened">
        <values-block class="mt-1 lg:mt-3">
          <template slot="left-top">
            <div class="headline">3rd Party / GitCoin</div>
          </template>
          <template slot="left-bottom">
            <div class="address hidden lg:block">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
          </template>
          <template slot="right-top">
            <div class="flex md:flex-col whitespace-nowrap">
              <div class="value mr-2 md:mr-0">0.01 ETH</div>
              <div class="secondaryValue">5.44 $</div>
            </div>
          </template>
        </values-block>
        <values-block class="mt-1 lg:mt-3">
          <template slot="left-top">
            <div class="headline">Tx Batch Fee / zkSync</div>
          </template>
          <template slot="left-bottom">
            <div class="address hidden lg:block">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
          </template>
          <template slot="right-top">
            <div class="flex md:flex-col whitespace-nowrap">
              <div class="value mr-2 md:mr-0">0.0003 ETH</div>
              <div class="secondaryValue">0.16 $</div>
            </div>
          </template>
        </values-block>
      </max-height>
      <div class="w-full border-b-2 border-light mt-1 lg:mt-3"></div>
      <div class="mt-2 lg:mt-4 flex">
        <div class="flex-2">
          <div class="font-firaCondensed font-bold text-xl md:text-2xl text-dark">Total amount</div>
        </div>
        <div class="flex-1 flex flex-col items-end">
          <div class="font-firaCondensed font-bold text-lg text-violet md:mt-1">
            205.32 USD
            <span @click="totalOpened=!totalOpened">
              <i class="transition-transform ease transition-200 far fa-angle-down" :style="{'transform': `rotate(${totalOpened===true?-180:0}deg)`}"></i>
            </span>
          </div>
          <max-height v-model="totalOpened">
            <div class="md:flex flex-col items-end">
            <div class="flex items-center font-firaCondensed font-bold text-xs text-black2 mt-2">
              <div>0.0103 ETH</div>
              <img class="ml-1 w-4 h-4 object-contain" src="/tokens/eth.svg" alt="ETH">
            </div>
            <div class="flex items-center font-firaCondensed font-bold text-xs text-black2 mt-2">
              <div>0.000103 BTC</div>
              <img class="ml-1 w-4 h-4 object-contain" src="/tokens/btc.svg" alt="BTC">
            </div>
            <div class="flex items-center font-firaCondensed font-bold text-xs text-black2 mt-2">
              <div>15.13 LINK</div>
              <img class="ml-1 w-4 h-4 object-contain" src="/tokens/link.svg" alt="LINK">
            </div>
          </div>
          </max-height>
        </div>
      </div>
      <div class="footerContainer hidden md:block">
        <footer>
          <div class="poweredBy flex justify-center items-center pt-5">
            <div class="text-lg font-firaCondensed font-medium uppercase text-violet mr-3">Powered by</div>
            <img class="zkSyncLogoFull h-12" src="/zkSyncLogoFull.svg" alt="zkSync">
          </div>
          <div class="poweredBy flex justify-center items-center mt-3">
            <a target="_blank" href="https://zksync.io/legal/terms.html#overview" class="linkDefault">Terms of Service</a>
            <a target="_blank" href="https://zksync.io/legal/privacy.html#introduction" class="linkDefault ml-5">Privacy Policy</a>
          </div>
        </footer>
        <img class="zkSyncFooter" src="/zkSyncFooter.svg" alt="zkSync">
      </div>
    </div>
  </aside>
</template>


<script lang="ts">
  import Vue from "vue";
  export default Vue.extend({
  data() {
    return {
      totalOpened: false,
      feesOpened: false,
      modal: false,
    }
  },
});
</script>
