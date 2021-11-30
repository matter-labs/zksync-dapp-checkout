<template>
  <aside class="infoBlockContainer bg-white h-screen">
    <div class="infoBlock border-none md:min-h-screen py-4 md:py-10 px-5 md:px-10">
      <header class="lg:mb-6">
        <div class="flex items-center">
          <logo class="h-8 lg:h-8 mr-2" />
          <div class="brandContainer text-violet -dark text-2xl font-bold flex flex-col lg:flex-row items-end md:items-start md:gap-2 mr-5 lg:justify-start leading-1">
            <h1 class="leading-1 -mb-1 lg:m-0 w-auto">Checkout</h1>
            <span class="networkName text-sm font-light inline-flex items-center">
              {{ network }}
            </span>
          </div>
        </div>
      </header>
      <vue-custom-scrollbar class="customScrollList transactionsList">
        <zk-values-block v-for="(item, index) in transactionData.transactions" :key="index" class="mt-2">
          <template slot="left-top">
            <div class="headline">
              {{ item.description }}
            </div>
          </template>
          <template slot="left-bottom">
            <div class="address hidden lg:block">
              {{ item.to }}
            </div>
          </template>
          <template slot="right-top">
            <div class="flex flex-col items-end whitespace-nowrap">
              <div class="value">
                {{ item.amount | formatUsdAmount(tokensPrices[item.token] && tokensPrices[item.token].price, item.token) }}
              </div>
              <div class="secondaryValue">{{ item.amount | formatToken(item.token) }} {{ item.token }}</div>
            </div>
          </template>
        </zk-values-block>
      </vue-custom-scrollbar>
      <div class="w-full">
        <div v-if="isInfoAvailable !== false" class="w-full border-b-2 border-light -dark pt-1 lg:pt-3" />
        <zk-values-block v-if="isInfoAvailable" class="pt-1 pb-0 lg:pt-3 cursor-pointer" @click="feesOpened = !feesOpened">
          <template slot="left-top">
            <div class="flex items-center">
              <div class="headline big">Fees</div>
              <span class="ml-3">
                <i class="transition-transform ease-ease duration-200 far fa-angle-down" :style="{ transform: `rotate(${feesOpened === true ? -180 : 0}deg)` }" />
              </span>
            </div>
          </template>
          <template slot="right-top">
            <div class="flex items-center">
              <div class="flex flex-col">
                <div class="value">
                  {{ totalFees | formatUsdAmount(tokensPrices[transactionData.feeToken] && tokensPrices[transactionData.feeToken].price, transactionData.feeToken) }}
                </div>
              </div>
            </div>
          </template>
        </zk-values-block>
        <zk-max-height v-model="feesOpened" :update-value="allFees.length">
          <zk-values-block v-for="(item, index) in allFees" :key="index" class="pt-1 lg:pt-3">
            <template slot="left-top">
              <div class="headline">
                {{ item.name }}
              </div>
            </template>
            <template slot="right-top">
              <div class="flex flex-col items-end whitespace-nowrap">
                <div class="value">
                  {{ item.amount | formatUsdAmount(tokensPrices[item.token] && tokensPrices[item.token].price, item.token) }}
                </div>
                <div class="secondaryValue">{{ item.amount | formatToken(item.token) }} {{ item.token }}</div>
              </div>
            </template>
          </zk-values-block>
          <zk-values-block class="pt-1 lg:pt-3" v-if="!loggedIn">
            <template slot="left-top">
              <div class="text-sm text-gray">May require additional one-time account activation fee</div>
            </template>
          </zk-values-block>
        </zk-max-height>

        <div v-if="isInfoAvailable !== false" class="w-full border-b-2 border-light -dark pt-1 lg:pt-3" />
        <transition name="fade">
          <div v-if="loggedIn" class="pt-2 lg:pt-4 flex cursor-pointer" @click="totalOpened = !totalOpened">
            <div class="flex-2">
              <div class="flex items-center">
                <div class="font-firaCondensed font-bold text-lg md:text-xl text-dark -dark">Total amount</div>
                <span class="ml-3">
                  <i class="transition-transform ease-ease duration-200 far fa-angle-down" :style="{ transform: `rotate(${totalOpened === true ? -180 : 0}deg)` }" />
                </span>
              </div>
            </div>
            <div class="flex-1 flex flex-col items-end">
              <div class="font-firaCondensed font-bold text-lg text-violet -dark md:mt-1">
                {{ totalUSD }}
              </div>
              <zk-max-height v-model="totalOpened" :update-value="allFees.length">
                <div class="md:flex flex-col items-end">
                  <div v-for="(item, token) in totalByToken" :key="token" class="flex items-center justify-end font-firaCondensed font-bold text-xs text-black2 -dark pt-1 md:pt-2">
                    <div>{{ item | formatToken(token) }} {{ token }}</div>
                  </div>
                </div>
              </zk-max-height>
            </div>
          </div>
        </transition>
      </div>
      <div class="footerContainer hidden md:block">
        <footer>
          <div class="poweredBy flex justify-center items-center mt-3">
            <a target="_blank" href="https://zksync.io/legal/terms.html#overview" class="linkDefault lightLink">Terms of Service</a>
            <a target="_blank" href="https://zksync.io/legal/privacy.html#introduction" class="linkDefault lightLink ml-5">Privacy Policy</a>
            <a target="_blank" v-show="!isMainnet" :href="zkMint" class="linkDefault lightLink ml-5">zkMint</a>
          </div>
        </footer>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from "vue";
import utils from "@/plugins/utils";
import { GweiBalance, TokenPrices, TotalByToken, TransactionData, TransactionFee } from "@/types/index";
import { BigNumber } from "ethers";
import Logo from "@/blocks/logo.vue";
import { ETHER_NETWORK_NAME, ETHER_PRODUCTION } from "~/plugins/build";

export default Vue.extend({
  components: {
    Logo,
  },
  data() {
    return {
      totalOpened: false,
      feesOpened: false,
    };
  },
  computed: {
    isInfoAvailable(): boolean {
      if (this.transactionData.transactions.length < 1) {
        return false;
      }
      return this.$store.getters["checkout/getErrorState"] !== true;
    },
    zkMint(): string {
      return `https://mint${this.network === "ropsten" ? "-ropsten" : ""}.zksync.dev`;
    },
    loggedIn(): boolean {
      return this.$store.getters["account/loggedIn"];
    },
    network(): string {
      return ETHER_NETWORK_NAME;
    },
    isMainnet(): boolean {
      return ETHER_PRODUCTION;
    },
    transactionData(): TransactionData {
      return this.$store.getters["checkout/getTransactionData"];
    },
    allFees(): Array<TransactionFee> {
      if (!this.loggedIn) {
        return this.$store.getters["checkout/getAllFees"].filter((item: TransactionFee) => item.key !== "changePubKey");
      }
      return this.$store.getters["checkout/getAllFees"];
    },
    totalFees(): GweiBalance {
      const allFees = this.allFees;
      let totalFeeBigNum = BigNumber.from("0");

      for (const item of allFees) {
        if (item.key === "changePubKey" && !this.loggedIn) {
          continue;
        }
        totalFeeBigNum = totalFeeBigNum.add(item.amount);
      }

      return totalFeeBigNum?.toString();
    },
    totalUSD(): string {
      const transactionData = this.transactionData;
      const allFees = this.allFees;
      const tokensPrices = this.tokensPrices;
      let totalUSD = 0;
      for (const item of [...transactionData.transactions, ...allFees]) {
        totalUSD += +tokensPrices[item.token].price * +utils.handleFormatToken(item.token, item.amount as string);
      }
      return totalUSD < 0.01 ? "<$0.01" : `$${totalUSD.toFixed(2)}`;
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