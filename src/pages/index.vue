<template>
  <div class="indexPage">
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
        <div class="amount">9,103</div>
      </template>
      <template slot="third">
        <div class="amount disabled">4,032</div>
      </template>
      <template slot="right">
        <i class="text-base text-green fas fa-check-circle"></i>
      </template>
    </line-block>
    <line-block>
      <template slot="first">
        <div class="tokenItem">
          <img alt="ETH" class="tokenImg" src="/tokens/eth.svg">
          <div class="tokenName">ETH</div>
        </div>
      </template>
      <template slot="right">
        <defbtn disabled loader outline>
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
        <div class="amount disabled">15,035</div>
      </template>
      <template slot="third">
        <div class="amount">2,195</div>
      </template>
      <template slot="default">
        <div class="alert text-red">
          <i class="alertIcon fas fa-exclamation-circle"></i>
          <span class="alertText">Unsufficient funds on L2</span>
        </div>
      </template>
      <template slot="right">
        <amount-input value="6,0637">
          <template slot="underInput">
            Required
          </template>
          <template slot="default">
            <defbtn>Deposit</defbtn>
          </template>
        </amount-input>
      </template>
    </line-block>

    <div class="mt-5 flex justify-center">
      <defbtn outline>
        <i class="far fa-arrow-left"></i>
        <span>Cancel and return</span>
      </defbtn>
      <defbtn class="ml-3" disabled outline>
        <i class="far fa-ban"></i>
        <span>Transfer assets</span>
      </defbtn>
    </div>
  </div>
</template>

<script>
import connectedWallet from "@/blocks/connectedWallet.vue";
import lineTableHeader from "@/blocks/lineTableHeader.vue";

export default {
  components: {
    connectedWallet,
    lineTableHeader,
  },
};
</script>
