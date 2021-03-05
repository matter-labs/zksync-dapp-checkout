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
        <div class="flex items-center justify-center flex-wrap">
          <!-- <div class="flex mb-2 md:mb-0">
          </div> -->
          <defbtn outline class="mb-2 mr-2 lg:mb-0" @click="modal=false">
            <i class="far fa-arrow-left"></i>
            <span>Cancel and return</span>
          </defbtn>
          <defbtn outline class="mb-2 lg:mb-0 md:mr-2" @click="modal=false">
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
        <i class="pl-1 text-base lg:text-lg text-red far fa-ban"></i>
      </template>
      <template slot="default">
        <div class="text-red text-xs lg:text-sm">
          Unfortunately, you don’t have enough funds on L2.
          <br class="hidden md:block">
          You need to deposit some tokens into zkSync in order to proceed.
        </div>
      </template>
    </note>

    <line-table-header class="mt-4 md:mt-7"/>

    <line-block>
      <template slot="first">
        <div class="tokenItem">
          <img src="/tokens/btc.svg" alt="BTC" class="tokenImg">
          <div class="tokenName">BTC</div>
        </div>
      </template>
      <template slot="second">
        <div class="amount">9.103 <span class="amountType md:hidden">L2</span></div>
      </template>
      <template slot="third">
        <div class="amount disabled">4.032 <span class="amountType md:hidden">L1</span></div>
      </template>
      <template slot="right">
        <i class="text-base text-green fas fa-check-circle"></i>
      </template>
    </line-block>
    <line-block>
      <template slot="first">
        <div class="tokenItem">
          <img src="/tokens/eth.svg" alt="ETH" class="tokenImg">
          <div class="tokenName">ETH</div>
        </div>
      </template>
      <template slot="second">
        <div class="amount disabled">1.0335 <span class="amountType md:hidden">L2</span></div>
      </template>
      <template slot="third">
        <div class="amount">0.2195 <span class="amountType md:hidden">L1</span></div>
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
            <img src="/tokens/link.svg" alt="LINK" class="tokenImg">
            <div class="tokenName">LINK</div>
        </div>
      </template>
      <template slot="second">
        <div class="amount disabled">15.035 <span class="amountType md:hidden">L2</span></div>
      </template>
      <template slot="third">
        <div class="amount">2.195 <span class="amountType md:hidden">L1</span></div>
      </template>
      <!-- <template slot="default">
        <div class="alert text-red">
          <i class="alertIcon fas fa-exclamation-circle"></i>
          <div class="alertText">Unsufficient funds</div>
        </div>
      </template> -->
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
import connectedWallet from "@/blocks/connectedWallet.vue";
import lineTableHeader from "@/blocks/lineTableHeader.vue";
import Vue from "vue";

export default Vue.extend({
                            components: {
                              connectedWallet,
                              lineTableHeader
                            },
                            data() {
                              return {
                                modal: false,
                                input: {
                                  token:  {
                                    symbol: "ETH"
                                  },
                                  amount: "0.03"
                                }
                              }
                            }
                          });
</script>
