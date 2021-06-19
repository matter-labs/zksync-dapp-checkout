<template>
  <div class="linkPage container w-full h-full">
    <zk-modal v-model="wrongDataModal" @close="wrongDataModal=false">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
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
          <i class="fad fa-box-check" />
          <div>Payment link created</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center leading-tight mb-4">Your payment link has been created!<br>Now you can share it with someone.</div>
        <div class="successLinkContainer">
          <zk-input size="sm" :value="paymentLink" disabled />
          <zk-defbtn id="copy-link" @click="copyLink()" v-popover:copy-link.bottom>
            <span>Copy</span>
            <i class="fal fa-clipboard"></i>
          </zk-defbtn>
          <zk-defbtn outline square @click="twitterShare()">
            <i class="fab fa-twitter"></i>
          </zk-defbtn>
          <zk-defbtn outline square @click="facebookShare()">
            <i class="fab fa-facebook-f"></i>
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

    <div class="linkHeader pt-10">
      <div class="flex items-center justify-center">
        <svg class="block h-16" viewBox="0 0 393 392" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path d="m214.147 207.039c-5.613 19.181-21.23 33.669-40.757 37.813-29.202 6.202-58.008-12.521-64.205-41.727s12.521-58.009 41.727-64.206c8.104-1.719 13.279-9.683 11.56-17.786-1.72-8.104-9.683-13.284-17.787-11.56-45.387 9.631-74.477 54.392-64.846 99.778 8.387 39.525 43.41 66.688 82.293 66.688 5.767 0 11.624-.599 17.486-1.843 30.34-6.437 54.604-28.942 63.322-58.732 2.327-7.95-2.232-16.282-10.184-18.609-7.949-2.321-16.282 2.233-18.609 10.184z"/>
            <path d="m198.131 125.633c-28.867 11.763-48.867 38.338-52.194 69.355-.883 8.236 5.078 15.63 13.314 16.514 8.238.884 15.631-5.077 16.515-13.314 2.148-20.025 15.056-37.182 33.685-44.771 27.866-11.354 59.771 2.079 71.124 29.943 5.5 13.498 5.414 28.33-.242 41.764-5.655 13.434-16.204 23.86-29.701 29.359-7.672 3.126-11.357 11.88-8.231 19.552 2.371 5.818 7.978 9.344 13.896 9.344 1.885 0 3.802-.357 5.654-1.112 20.919-8.523 37.267-24.684 46.032-45.502 8.765-20.819 8.897-43.806.374-64.725-17.594-43.184-67.04-63.997-110.226-46.407z"/>
            <path d="m310.724.929h-228.828c-45.158 0-81.896 36.738-81.896 81.896v226.97c0 45.157 36.738 81.896 81.896 81.896h228.828c45.158 0 81.896-36.738 81.896-81.896v-226.97c0-45.158-36.739-81.896-81.896-81.896zm51.896 308.866c0 28.615-23.28 51.896-51.896 51.896h-228.828c-28.616 0-51.896-23.281-51.896-51.896v-226.97c0-28.616 23.28-51.896 51.896-51.896h228.828c28.616 0 51.896 23.28 51.896 51.896z"/>
          </g>
        </svg>
        <div class="text-6xl text-violet pl-6 font-medium">zkLink</div>
      </div>
      <div class="text-lg text-gray text-center">Create zkSync payment links, get paid in tokens</div>
    </div>
    <div class="linkBody py-10">
      <payment-item class="my-2" v-for="(item, index) in payments" :index="index" :displayIndex="payments.length>=5" :displayDelete="payments.length>=2" :key="index" v-model="payments[index]" @delete="deletePayment(index)" />
      <zk-defbtn outline class="mx-auto mt-5" @click="addPayment()" :disabled="payments.length>=maxPayments">Add another transaction</zk-defbtn>
      <div class="text-gray text-sm text-center leading-tight pt-2" :class="{'text-dark': payments.length>=maxPayments}">{{payments.length>=5 ? `${payments.length}/` : 'Up to '}}{{maxPayments}} transactions</div>
    </div>
    <div class="linkFooter">
      <zk-defbtn class="mx-auto mt-5" big @click="generate()">Create your payment link</zk-defbtn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PaymentItem } from "@/types";
import { encrypt } from "@/plugins/link";
import { TWEET_URL, FACEBOOK_URL } from "@/plugins/build";

export default Vue.extend({
  layout: "link",
  data() {
    return {
      payments: <PaymentItem[]>[],
      wrongDataModal: false,
      successModal: false,
      previewLoading: false,
      paymentHash: "",
      maxPayments: 20,
    }
  },
  computed: {
    paymentLink(): string {
      return window.location.origin + "/link/" + this.paymentHash;
    },
  },
  methods: {
    deletePayment(index: number) {
      this.payments.splice(index, 1);
    },
    addPayment() {
      if(this.payments.length>=this.maxPayments) {
        return;
      }
      let address = "";
      let token = "ETH";
      if(this.payments.length > 0) {
        address = this.payments[this.payments.length-1].address;
        token = this.payments[this.payments.length-1].token;
      }
      this.payments.push({
        address,
        amount: "",
        token,
      });
    },
    generate() {
      for(const payment of this.payments) {
        if(!payment.address || !payment.amount) {
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
      window.open(`${TWEET_URL}${encodeURIComponent(this.paymentLink)}`, '_blank');
    },
    facebookShare() {
      window.open(`${FACEBOOK_URL}${encodeURIComponent(this.paymentLink)}`, '_blank');
    },
  },
  mounted() {
    this.addPayment();
  },
});
</script>
