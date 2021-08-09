<template>
  <div class="linkPage container w-full h-full py-10">
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
      <div class="flex items-stretch justify-center">
        <img src="@/static/zkSyncLogo.svg" class="block head-logo" height="100%" alt="Checkout service by zkSync">
        <h1 class="text-5xl text-violet pl-6 font-medium">
          Checkout
          <a class="lightLink" href="https://zksync.io" target="_blank">by zkSync</a>
        </h1>
      </div>
      <ul class="feature-list zk-container text-center mt-4 mr-auto ml-auto mb-6 flex-col items-center text-gray-600 dark:text-gray-100 w-full">
        <li class="flex-shrink-0 pr-4 headline big text-violet mb-3">
          Get paid in tokens with zkSync:
        </li>
        <li class="mb-3 text-md flex font-light text-dark items-center ">
          <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="6" height="6" stroke="currentColor" fill="#5436d6" viewBox="0 0 1792 1792">
            <path
              d="M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"
            >
            </path>
          </svg>
          Create instant permissionless payout links
        </li>
        <li class="mb-3 text-md flex font-light text-dark items-center ">
          <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="6" height="6" stroke="currentColor" fill="#5436d6" viewBox="0 0 1792 1792">
            <path
              d="M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"
            >
            </path>
          </svg>
          Plug-n-play up to 70 transaction as a single payment batch
        </li>
        <li class="mb-3 text-md flex font-light text-dark ">
          <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="6" height="6" stroke="currentColor" fill="#5436d6" viewBox="0 0 1792 1792">
            <path
              d="M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"
            >
            </path>
          </svg>
          Use our&nbsp;<a href="https://zksync.io/api/sdk/checkout/" CLASS="lightLink" target="_blank">zkCheckout SDK</a>&nbsp;to integrate any fully-featured checkout
        </li>
      </ul>
    </div>
    <div class="linkBody py-10">
      <h2 class="mx-auto text-center zk-container headline big text-violet mb-3">
        Create your instant payment link:
      </h2>
      <div class="w-full py-2 md:py-1" v-for="(_item, index) in payments" :key="index">
        <payment-item :displayIndex="payments.length>=5" :displayDelete="payments.length>=2" :index="index" v-model="payments[index]" @delete="deletePayment(index)"/>
      </div>
      <zk-defbtn outline class="mx-auto mt-5" @click="addPayment()" :disabled="payments.length>=maxPayments">Add another transaction</zk-defbtn>
      <div class="text-gray text-sm text-center leading-tight pt-2" :class="{'text-dark': payments.length>=maxPayments}">{{
          payments.length >= 5 ? `${payments.length}/`:"Up to "
        }}{{ maxPayments }} transactions
      </div>
      <zk-defbtn class="mx-auto mt-5" big @click="generate()" dis>Create your payment link</zk-defbtn>
    </div>
    <div class="linkFooter">

    </div>
  </div>
</template>

<script lang="ts">
import {FACEBOOK_URL, TWEET_URL} from "@/plugins/build";
import {encrypt} from "@/plugins/link";
import {PaymentItem} from "@/types";
import Vue from "vue";

export default Vue.extend({
  layout: "link",
  head() {
    return {
      title: "zkLink - Create zkSync payment links"
    };
  },
  data() {
    return {
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
  mounted() {
    this.addPayment();
  }
});
</script>
