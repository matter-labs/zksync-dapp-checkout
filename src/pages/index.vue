<template>
  <div class="indexPage">
    <modal v-model="modal">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"></i>
          <div>Insufficient funds in the on-chain wallet to deposit</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm">On-chain wallet has insufficient funds to deposit minimal amount to zkSync L2 account. Top it up your on-chain wallet with minimal amount:</div>
        <values-block class="mt-3">
          <template slot="left-top">
            <div class="headline">Minimal amount to deposit</div>
          </template>
          <template slot="left-bottom">
            <div class="address hidden md:block">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
          </template>
          <template slot="right-top">
            <div class="flex md:flex-col whitespace-nowrap">
              <div class="value mr-2 md:mr-0">6.051 LINK</div>
              <div class="secondaryValue">23.45 $</div>
            </div>
          </template>
        </values-block>
      </template>
      <template slot="footer">
        <div class="flex items-center justify-center flex-wrap gap-2">
          <defbtn outline @click="modal=false">
            <i class="far fa-arrow-left"></i>
            <span>Cancel and return</span>
          </defbtn>
          <defbtn outline @click="modal=false">
            <span>Disconnect</span>
            <i class="far fa-power-off"></i>
          </defbtn>
          <defbtn @click="modal=false">
            <i class="far fa-sync-alt"></i>
            <span>All is done. Reload the checkout</span>
          </defbtn>
        </div>
      </template>
    </modal>

    <modal :value="errorModal!==false" @close="errorModal=false">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"></i>
          <div>{{errorModal.headline}}</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm">{{errorModal.text}}</div>
      </template>
    </modal>

    <connected-wallet/>

    <note v-if="accountLocked">
      <template slot="icon">
        <i class="pl-1 text-base lg:text-lg text-gray far fa-unlock-alt"></i>
      </template>
      <template slot="default">
        <div class="text-gray text-xs lg:text-sm">
          To start using your account you need to register your public key once. This operation costs 15000 gas on-chain. In the future, we will eliminate this step by verifying ETH signatures with zero-knowledge proofs. Please bear with us!
        </div>
      </template>
    </note>

    <div class="w-full" v-if="step==='main'">
      <line-table-header class="mt-4 md:mt-7"/>
      <transaction-token v-for="(total, token) in totalByToken" :key="token" :token="token" :total="total.toString()" />
      <div class="mainBtnsContainer" v-if="!accountLocked">
        <div class="mainBtns">
          <defbtn class="mr-3 desktopOnly" outline :disabled="loading" @click="cancel()">
            <i class="far fa-arrow-left"></i>
            <span>Cancel and return</span>
          </defbtn>
          <defbtn class="desktopOnly" :disabled="loading" :loading="loading" @click="nextStep()">
            <i class="far fa-exchange"></i>
            <span>Transfer assets</span>
          </defbtn>
          <defbtn class="mobileOnly" big square outline :disabled="loading" @click="cancel()">
            <i class="far fa-arrow-left"></i>
          </defbtn>
          <defbtn class="mobileOnly" big :disabled="loading" :loading="loading" @click="nextStep()">
            <i class="far fa-exchange"></i>
            <span>Transfer assets</span>
          </defbtn>
        </div>
      </div>
      <div class="mainBtnsContainer" v-else>
        <div class="mainBtns">
          <defbtn class="mr-3 desktopOnly" outline :disabled="loading" @click="cancel()">
            <i class="far fa-arrow-left"></i>
            <span>Cancel and return</span>
          </defbtn>
          <defbtn class="desktopOnly" :loader="loading" :disabled="loading" @click="nextStep()">
            <span><i class="fas fa-unlock-alt"></i> Activate the account</span>
          </defbtn>
          <defbtn class="mobileOnly" big square outline :disabled="loading" @click="cancel()">
            <i class="far fa-arrow-left"></i>
          </defbtn>
          <defbtn class="mobileOnly" big :loader="loading" :disabled="loading" @click="nextStep()">
            <i class="far fa-exchange"></i>
            <span><i class="fas fa-unlock-alt"></i> Activate the account</span>
          </defbtn>
        </div>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { TransactionData, TotalByToken, Balance } from "@/plugins/types";
import { changePubKey } from "@/plugins/walletActions/transaction";

import connectedWallet from "@/blocks/connectedWallet.vue";
import lineTableHeader from "@/blocks/lineTableHeader.vue";



export default Vue.extend({
  components: {
    connectedWallet,
    lineTableHeader
  },
  data() {
    return {
      modal: false,
      step: 'main',
      loading: false,
      errorModal: false as (false | {
        headline: string,
        text: string,
      }),
    }
  },
  computed: {
    zkBalances: function(): Array<Balance> {
      return this.$store.getters['wallet/getzkBalances'];
    },
    transactionData: function(): TransactionData {
      return this.$store.getters['checkout/getTransactionData'];
    },
    totalByToken: function(): TotalByToken {
      return this.$store.getters['checkout/getTotalByToken'];
    },
    accountLocked: function(): Boolean {
      return this.$store.getters['wallet/isAccountLocked'];
    },
  },
  methods: {
    nextStep: function() {
      if(this.step==='main') {
        if(this.accountLocked) {
          this.changePubKey();
        }
        else {
          this.transfer();
        }
      }
    },
    changePubKey: async function() {
      this.loading=true;
      try {
        await changePubKey(this.transactionData.feeToken, this.$store);
        await this.$store.dispatch("wallet/getzkBalances", { accountState: undefined, force: true });
      } catch (error) {
        const createErrorModal = (text: string) => {
          this.errorModal = {
            headline: `Activating account error`,
            text: text
          }
        }
        if (error.message) {
          if (!error.message.includes("User denied")) {
            createErrorModal(error.message);
          }
        }
        else {
          createErrorModal("Unknow error. Try again later.");
        }
      }
      this.loading=false;
    },
    transfer: async function() {

    },
    cancel: async function() {
      if(this.loading){return}
      if(this.step==='main') {

      }
    },
  },
});
</script>
