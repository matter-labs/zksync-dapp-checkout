<template>
  <aside class="infoBlockContainer bg-white h-screen">
    <div class="infoBlock md:min-h-screen py-4 md:py-10 px-5 md:px-10">
      <header class="md:mb-6">
        <div class="flex items-center">
          <img class="w-10 h-10 mr-2" src="/zkSyncLogo.svg" alt="zkSync" />
          <div class="text-violet text-2xl font-bold">
            zkCheckout <sup v-if="!isMainnet" class="text-sm font-light">{{ network }} <span v-if="isBeta" class="text-xs font-bold text-red ml-1"> beta</span></sup>
          </div>
        </div>
      </header>
      <values-block v-for="(item, index) in transactionData.transactions" :key="index" class="mt-2">
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
          <div class="flex md:flex-col whitespace-nowrap">
            <div class="value mr-2 md:mr-0">
              {{ item.amount | formatUsdAmount(tokensPrices[item.token] && tokensPrices[item.token].price, item.token) }}
            </div>
            <div class="secondaryValue">{{ item.amount | formatToken(item.token) }} {{ item.token }}</div>
          </div>
        </template>
      </values-block>
      <transition name="fade">
        <div v-if="loggedIn" class="w-full">
          <div class="w-full border-b-2 border-light mt-1 lg:mt-3" />
          <values-block class="mt-1 lg:mt-3 cursor-pointer" @click="feesOpened = !feesOpened">
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
                <div class="flex md:flex-col">
                  <div class="value md:mr-0">
                    {{ totalFees | formatUsdAmount(tokensPrices[transactionData.feeToken] && tokensPrices[transactionData.feeToken].price, transactionData.feeToken) }}
                  </div>
                </div>
              </div>
            </template>
          </values-block>
          <max-height v-model="feesOpened" :update-value="allFees.length">
            <values-block v-for="(item, index) in allFees" :key="index" class="mt-1 lg:mt-3">
              <template slot="left-top">
                <div class="headline">
                  {{ item.name }}
                </div>
              </template>
              <template slot="right-top">
                <div class="flex md:flex-col whitespace-nowrap">
                  <div class="value mr-2 md:mr-0">
                    {{ item.amount | formatUsdAmount(tokensPrices[item.token] && tokensPrices[item.token].price, item.token) }}
                  </div>
                  <div class="secondaryValue">{{ item.amount | formatToken(item.token) }} {{ item.token }}</div>
                </div>
              </template>
            </values-block>
          </max-height>
          <div class="w-full border-b-2 border-light mt-1 lg:mt-3" />
          <div class="mt-2 lg:mt-4 flex cursor-pointer" @click="totalOpened = !totalOpened">
            <div class="flex-2">
              <div class="flex items-center">
                <div class="font-firaCondensed font-bold text-lg md:text-xl text-dark">Total amount</div>
                <span class="ml-3">
                  <i class="transition-transform ease-ease duration-200 far fa-angle-down" :style="{ transform: `rotate(${totalOpened === true ? -180 : 0}deg)` }" />
                </span>
              </div>
            </div>
            <div class="flex-1 flex flex-col items-end">
              <div class="font-firaCondensed font-bold text-lg text-violet md:mt-1">
                {{ totalUSD }}
              </div>
              <max-height v-model="totalOpened" :update-value="allFees.length">
                <div class="md:flex flex-col items-end">
                  <div v-for="(item, token) in totalByToken" :key="token" class="flex items-center justify-end font-firaCondensed font-bold text-xs text-black2 mt-2">
                    <div>{{ item | formatToken(token) }} {{ token }}</div>
                  </div>
                </div>
              </max-height>
            </div>
          </div>
        </div>
      </transition>
      <div class="footerContainer hidden md:block">
        <footer>
          <div class="poweredBy flex gap-4 justify-center items-center mt-3">
            <a v-for="(item, index) in links" :key="index" target="_blank" :href="item.url" class="linkDefault lightLink">{{ item.title }}</a>
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
import { ETHER_NETWORK_NAME, ETHER_PRODUCTION, ZK_IS_BETA } from "~/plugins/build";

export default Vue.extend({
  data() {
    return {
      totalOpened: false,
      feesOpened: false,
      links: [
        {
          title: "Terms",
          url: "https://zksync.io/legal/terms.html#introduction",
        },
        {
          title: "Privacy",
          url: "https://zksync.io/legal/privacy.html#introduction",
        },
        {
          title: "Docs",
          url: "https://zksync.io/api/sdk/checkout/tutorial.html#getting-started",
        },
        {
          title: "zkLink",
          url: "https://link.zksync.io/",
        },
        {
          title: "zkSync",
          url: "https://zksync.io",
        },
      ],
    };
  },
  computed: {
    loggedIn(): boolean {
      return this.$store.getters["account/loggedIn"];
    },
    network(): string {
      return ETHER_NETWORK_NAME;
    },
    isBeta(): boolean {
      return ZK_IS_BETA;
    },
    isMainnet(): boolean {
      return ETHER_PRODUCTION;
    },
    transactionData(): TransactionData {
      return this.$store.getters["checkout/getTransactionData"];
    },
    allFees(): Array<TransactionFee> {
      return this.$store.getters["checkout/getAllFees"];
    },
    totalFees(): GweiBalance {
      const allFees = this.allFees;
      let totalFeeBigNum = BigNumber.from("0");
      for (const item of allFees) {
        totalFeeBigNum = totalFeeBigNum.add(item.amount);
      }
      return totalFeeBigNum.toString();
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
