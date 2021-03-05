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
            <div class="address">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
          </template>
          <template slot="right-top">
            <div class="value">6.051 LINK</div>
          </template>
          <template slot="right-bottom">
            <div class="secondaryValue">23.45 $</div>
          </template>
        </values-block>
      </template>
      <template slot="footer">
        <div class="flex justify-center">
          <defbtn outline class="mr-2" @click="modal=false">
            <i class="far fa-arrow-left"></i>
            <span>Cancel and return</span>
          </defbtn>
          <defbtn outline class="mr-2" @click="modal=false">
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

    <connected-wallet/>
    <note>
      <template slot="icon">
        <i class="pl-1 text-lg text-red far fa-ban"></i>
      </template>
      <template slot="default">
        <div class="text-red text-sm">
          Unfortunately, you don’t have enough funds on L2.<br>
          You need to deposit some tokens into zkSync in order to proceed.
        </div>
      </template>
    </note>

    <line-table-header class="mt-7"/>
    <line-block>
      <template slot="first">
        <div class="tokenItem">
          <img alt="BTC" class="tokenImg" src="/tokens/btc.svg">
          <div class="tokenName">BTC</div>
        </div>
      </template>
      <template slot="second">
        <div class="amount">9.103</div>
      </template>
      <template slot="third">
        <div class="amount disabled">4.032</div>
      </template>
      <template slot="right">
        <i class="text-base text-green fas fa-check-circle"></i>
      </template>
    </line-block>
    <line-block>
      <template slot="first">
        <div class="tokenItem">
          <div>
            <img src="/tokens/eth.svg" alt="ETH" class="tokenImg">
          <div class="tokenName">ETH</div>
          </div>
        </div>
      </template>
      <template slot="right">
        <defbtn outline disabled loader>
          <span>Unlocking... </span>
        </defbtn>
      </template>
    </line-block>
    <line-block>
      <template slot="first">
        <div class="tokenItem">
          <img alt="LINK" class="tokenImg" src="/tokens/link.svg">
          <div class="tokenName">LINK</div>
        </div>
      </template>
      <template slot="second">
        <div class="amount disabled">15.035</div>
      </template>
      <template slot="third">
        <div class="amount">2.195</div>
      </template>
      <template slot="default">
        <div class="alert text-red">
          <i class="alertIcon fas fa-exclamation-circle"></i>
          <div class="alertText">Unsufficient funds</div>
        </div>
      </template>
      <template slot="right">
        <amount-input v-model="input.amount" :token="input.token">
          <template slot="underInput">
            Required
          </template>
          <template slot="default">
            <defbtn @click="modal=true">Deposit</defbtn>
          </template>
        </amount-input>
      </template>
    </line-block>

    <div class="mainBtnsContainer">
      <div class="mainBtns">
        <defbtn class="mr-3 desktopOnly" outline @click="modal=true">
          <i class="far fa-arrow-left"></i>
        <span>Cancel and return</span>
      </defbtn>
        <defbtn class="desktopOnly" @click="modal=true">
          <i class="far fa-exchange"></i>
          <span>Transfer assets</span>
        </defbtn>
        <defbtn class="mobileOnly" big square outline @click="modal=true">
          <i class="far fa-arrow-left"></i>
        </defbtn>
        <defbtn class="mobileOnly" big @click="modal=true">
          <i class="far fa-exchange"></i>
        <span>Transfer assets</span>
      </defbtn>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import connectedWallet from '@/blocks/connectedWallet.vue';
import lineTableHeader from '@/blocks/lineTableHeader.vue';

export default Vue.extend({
  components: {
    connectedWallet,
    lineTableHeader
  },
  data() {
    return {
      modal: false,
      input: {
        token: {
          symbol: 'ETH'
        },
        amount: '0.03'
      }
    }
  },
});
</script>
