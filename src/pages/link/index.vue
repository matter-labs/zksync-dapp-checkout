<template>
  <div class="linkPage container h-full pt-5 px-3 md:py-10">
    <zk-modal v-model="wrongDataModal" @close="wrongDataModal=false">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"/>
          <div>Wrong data</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center">
          Some of the data is missing or inputted values are invalid.<br>Please, try again.
        </div>
      </template>
    </zk-modal>

    <zk-modal :not-closable="previewLoading" v-model="successModal" @close="successModal=false">
      <template slot="header">
        <div class="withIcon text-green">
          <i class="fad fa-box-check"/>
          <div>Payment link created</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center leading-tight mb-4">Your payment link has been created!<br>Now you can share it with someone.</div>
        <div class="successLinkContainer">
          <zk-input size="sm" :value="paymentLink" disabled/>
          <zk-defbtn id="copy-link" @click="copyLink()" v-popover:copy-link.bottom>
            <span>Copy</span>
            <i class="fal fa-clipboard"/>
          </zk-defbtn>
          <zk-defbtn outline square @click="twitterShare()">
            <i class="fab fa-twitter"/>
          </zk-defbtn>
          <zk-defbtn outline square @click="facebookShare()">
            <i class="fab fa-facebook-f"/>
          </zk-defbtn>
          <popover name="copy-link" event="click" class="text-center block text-xs" :delay="100">
            Link copied!
          </popover>
        </div>
      </template>
      <template slot="footer">
        <div class="flex items-center justify-center flex-wrap gap-2">
          <zk-defbtn :disabled="previewLoading" outline @click="successModal=false">
            <i class="far fa-arrow-left"/>
            <span>Close</span>
          </zk-defbtn>
          <zk-defbtn @click.native="previewLoading=true" :loader="previewLoading" :to="`/link/${paymentHash}`">
            <span>Try now</span>
            <i v-if="!previewLoading" class="far fa-arrow-right"/>
          </zk-defbtn>
        </div>
      </template>
    </zk-modal>

    <div class="linkHeader">
      <nuxt-link to="/link" class="flex items-center justify-center">
        <img src="@/static/zkSyncLogo.svg" class="head-logo" alt="Checkout by zkSync">
        <h1 class="text-3xl md:text-5xl text-violet pl-2 md:pl-4 font-medium leading-loose">
          zkCheckout<span class="desktopOnly">:</span> <strong
          class="text-lg absolute md:relative md:text-5xl transform -translate-x-1/2 -translate-y-3 md:translate-y-0 md:translate-x-0 leading-loose">{{
            currentNetwork
          }}</strong>
        </h1>
      </nuxt-link>
      <ul
        class="feature-list zk-container font-light text-dark mt-4 mr-auto ml-auto mb-6  text-sm md:text-md flex-col items-center text-gray-600 dark:text-gray-100"
        v-if="!showAddLink"
      >
        <li class="flex-grow headline text-violet mb-3">
          Get paid in tokens with zkSync:
        </li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2"/>
          <span>Blazing-fast & cost efficient</span>
        </li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2"/>
          <span>Permissionless visual link builder</span>
        </li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2"/>
          <span>Up to {{ maxPayments }} transactions with different recipients</span>
        </li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2"/>
          <span><a href="https://zksync.io/api/sdk/checkout/" CLASS="lightLink" target="_blank">zkCheckout SDK</a>&nbsp;for the fully-featured checkout</span>
        </li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2"/>
          <span>Up to 70 transaction with customizable description & purpose using SDK</span>
        </li>
      </ul>
    </div>
    <div class="linkBody py-4 md:py-10">
      <h2 class="mx-auto text-center zk-container headline big text-violet mb-3" v-html="createLinkBlockTitle"/>
      <zk-defbtn class="mx-auto mt-5" v-if="!showAddLink" big @click="enableLink()">Try it now</zk-defbtn>
      <div class="w-full py-2 md:py-1" v-for="(_item, index) in payments" :key="index" v-if="showAddLink">
        <payment-item :displayIndex="payments.length>=5" :displayDelete="payments.length>=2" :index="index" v-model="payments[index]" @delete="deletePayment(index)"/>
      </div>
      <zk-defbtn outline class="mx-auto mt-5" @click="addPayment()" v-if="showAddLink" :disabled="payments.length>=maxPayments">Add another transaction</zk-defbtn>
      <div class="text-gray text-sm text-center leading-tight pt-2" :class="{'text-dark': payments.length>=maxPayments}" v-if="showAddLink">{{
          payments.length >= 5 ? `${payments.length}/`:"Up to "
        }}{{ maxPayments }} transactions
      </div>

    </div>
    <div class="linkFooter">
      <zk-defbtn class="mx-auto mt-5" v-if="showAddLink" :outline="!validCheckoutConfiguration" :disabled="!validCheckoutConfiguration" big @click="generate()" dis>Build your
        payment link</zk-defbtn>
      <div class="poweredBy pt-10 pb-5 flex items-center justify-center">
        <div class="text-violet mr-3">Powered by</div>
        <a class="h-8 w-max-content" target="_blank" href="https://zksync.io/">
          <block-logo class="h-8"/>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {ETHER_NETWORK_NAME, FACEBOOK_URL, TWEET_URL} from "@/plugins/build";
import {encrypt} from "@/plugins/link";
import {PaymentItem} from "@/types";
import Vue from "vue";

export default Vue.extend({
  layout: "link",
  data() {
    return {
      addLinkMode: false,
      payments: <PaymentItem[]>[],
      wrongDataModal: false,
      successModal: false,
      previewLoading: false,
      paymentHash: "",
      maxPayments: 20
    };
  },
  computed: {
    paymentLink(): string {
      return window.location.origin + "/link/" + this.paymentHash;
    },
    currentNetwork(): string {
      return ETHER_NETWORK_NAME;
    },
    showAddLink(): boolean {
      return this.addLinkMode;
    },
    createLinkBlockTitle(): string {
      return this.showAddLink ? `Create your <strong>${this.currentNetwork}</strong> instant payment link:`:
        `Build instant <strong>${this.currentNetwork}</strong> payout link in 5 mins`;
    },
    validCheckoutConfiguration(): boolean {
      if (this.payments.length < 1)
      {
        return false;
      }
      for (const payment of this.payments) {
        if (!payment.address || !payment.amount) {
          return false;
        }
      }
      return true;
    }
  },
  methods: {
    deletePayment(index: number) {
      this.payments.splice(index, 1);
    },
    addPayment() {
      if (this.payments.length >= this.maxPayments) {
        return;
      }
      let address = "";
      let token = "ETH";
      if (this.payments.length > 0) {
        address = this.payments[this.payments.length - 1].address;
        token = this.payments[this.payments.length - 1].token;
      }
      this.payments.push({
        address,
        amount: "",
        token
      });
    },
    enableLink() {
      this.addLinkMode = true;
      this.addPayment();
    },
    generate() {
      for (const payment of this.payments) {
        if (!payment.address || !payment.amount) {
          return this.wrongDataModal = true;
        }
      }
      this.paymentHash = encrypt(this.payments);
      this.successModal = true;
    },
    copyLink() {
      const elem = document.createElement("textarea");
      elem.style.position = "absolute";
      elem.style.left = -99999999 + "px";
      elem.style.top = -99999999 + "px";
      elem.value = this.paymentLink;
      document.body.appendChild(elem);
      elem.select();
      document.execCommand("copy");
      document.body.removeChild(elem);
    },
    twitterShare() {
      window.open(`${TWEET_URL}${encodeURIComponent(this.paymentLink)}`, "_blank");
    },
    facebookShare() {
      window.open(`${FACEBOOK_URL}${encodeURIComponent(this.paymentLink)}`, "_blank");
    }
  },
});
</script>
