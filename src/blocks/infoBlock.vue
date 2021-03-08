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
    </modal>

    <div class="infoBlock md:min-h-screen py-4 md:py-10 px-5 md:px-10">
      <header>
        <span class="mobileOnly" @click="modal=true">
          <i class="text-xl far fa-arrow-left"></i>
        </span>
        <div class="flex items-center">
          <img class="w-10 h-10 mr-2" src="/zkSyncLogo.svg" alt="zkSync">
          <div class="text-violet text-2xl font-bold">Checkout</div>
        </div>
        <span class="mobileOnly" @click="modal=true">
          <i class="text-xl fal fa-shield-check"></i>
        </span>
      </header>
      <note class="hidden md:block mt-3 lg:mt-7">
        <template slot="icon">
          <i class="text-gray text-base lg:text-lg fal fa-comment-alt-exclamation"></i>
        </template>
        <template slot="default">
          <div class="text-dark2 font-light text-xs lg:text-sm">By using zkSync: Checkout Gateway, you agree to accept full responsibility. See our <a class="lightLink" target="_blank" href="https://zksync.io/legal/terms.html#overview">Terms of Service</a> and <a class="lightLink" target="_blank" href="https://zksync.io/legal/privacy.html#introduction">Privacy Policy</a> for the details.</div>
        </template>
      </note>
      <div class="lg:mt-5"></div>
      <values-block v-for="(item,index) in transactionData.transactions" :key="index" class="mt-3">
        <template slot="left-top">
          <div class="headline">{{item.description}}</div>
        </template>
        <template slot="left-bottom">
          <div class="address hidden lg:block">{{item.to}}</div>
        </template>
        <template slot="right-top">
          <div class="flex md:flex-col whitespace-nowrap">
            <div class="value mr-2 md:mr-0">{{ item.amount | formatToken(item.token) }} {{item.token}}</div>
            <div class="secondaryValue">{{ item.amount | formatUsdAmount(tokensPrices[item.token].price, item.token) }}</div>
          </div>
        </template>
      </values-block>
      <div class="w-full border-b-2 border-light mt-1 lg:mt-3"></div>
      <values-block class="mt-1 lg:mt-3">
        <template slot="left-top">
          <div class="headline big" @click="feesOpened=!feesOpened">Fees</div>
        </template>
        <template slot="right-top">
          <div class="flex items-center" @click="feesOpened=!feesOpened">
            <div class="flex md:flex-col">
              <div class="value mr-2 md:mr-0">0.01 ETH</div>
              <div class="secondaryValue">5.44 $</div>
            </div>
            <span class="ml-3 md:hidden">
              <i class="transition-transform ease-ease duration-200 far fa-angle-down" :style="{'transform': `rotate(${feesOpened===true?-180:0}deg)`}"></i>
            </span>
          </div>
        </template>
      </values-block>
      <max-height v-model="feesOpened" :update-value="allFees.length" mobile-only>
        <values-block v-for="(item, index) in allFees" :key="index" class="mt-1 lg:mt-3">
          <template slot="left-top">
            <div class="headline">{{item.name}}</div>
          </template>
          <template slot="right-top">
            <div class="flex md:flex-col whitespace-nowrap">
              <div class="value mr-2 md:mr-0">{{ item.amount | formatToken(item.token) }} {{item.token}}</div>
              <div class="secondaryValue">{{ item.amount | formatUsdAmount(tokensPrices[item.token].price, item.token) }}</div>
            </div>
          </template>
        </values-block>
      </max-height>
      <div class="w-full border-b-2 border-light mt-1 lg:mt-3"></div>
      <div class="mt-2 lg:mt-4 flex" @click="totalOpened=!totalOpened">
        <div class="flex-2">
          <div class="font-firaCondensed font-bold text-xl md:text-2xl text-dark">Total amount</div>
        </div>
        <div class="flex-1 flex flex-col items-end">
          <div class="font-firaCondensed font-bold text-lg text-violet md:mt-1">
            {{totalUSD}} USD
            <span class="ml-2 md:hidden">
              <i class="transition-transform ease-ease duration-200 far fa-angle-down" :style="{'transform': `rotate(${totalOpened===true?-180:0}deg)`}"></i>
            </span>
          </div>
          <max-height v-model="totalOpened" :update-value="allFees.length" mobile-only>
            <div class="md:flex flex-col items-end">
            <div v-for="(item, token) in totalByToken" :key="token" class="flex items-center justify-end font-firaCondensed font-bold text-xs text-black2 mt-2">
              <div>{{ item | formatToken(token) }} {{token}}</div>
              <!-- <img class="ml-1 w-4 h-4 object-contain" src="/tokens/eth.svg" alt="ETH"> -->
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
import { TransactionData, transactionFee, TokenPrices, TotalByToken } from "@/plugins/types";

export default Vue.extend({
  data() {
    return {
      totalOpened: false,
      feesOpened: false,
      modal: false,
    };
  },
  computed: {
    transactionData(): TransactionData {
      return this.$store.getters["checkout/getTransactionData"];
    },
    allFees(): Array<transactionFee> {
      return this.$store.getters["checkout/getAllFees"];
    },
    totalUSD(): string {
      const transactionData = this.transactionData;
      const allFees = this.allFees;
      const tokensPrices = this.tokensPrices;
      let totalUSD = 0;
      for (const item of transactionData.transactions) {
        totalUSD += parseFloat(this.$options.filters!.formatUsdAmount(item.amount, tokensPrices[item.token].price, item.token).replaceAll(/[~$<]/g, ""));
      }
      for (const item of allFees) {
        totalUSD += parseFloat(this.$options.filters!.formatUsdAmount(item.amount, tokensPrices[item.token].price, item.token).replaceAll(/[~$<]/g, ""));
      }
      return totalUSD < 0.01 ? `<0.01` : `~${totalUSD.toFixed(2)}`;
    },
    totalByToken(): TotalByToken {
      return this.$store.getters["checkout/getTotalByToken"];
    },
    tokensPrices(): TokenPrices {
      return this.$store.getters["tokens/getTokenPrices"];
    },
  },
});
</script>
