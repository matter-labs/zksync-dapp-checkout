<template>
  <div class="linkPage container h-full pt-5 px-3 md:py-10">
    <zk-modal v-model="wrongDataModal" @close="wrongDataModal = false">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
          <div>Wrong data</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center">Some of the data is missing or inputted values are invalid.<br />Please, try again.</div>
      </template>
    </zk-modal>

    <zk-modal v-model="successModal" :not-closable="true" @close="successModal = false">
      <template slot="header">
        <div class="withIcon text-green">
          <i class="fad fa-box-check" />
          <div>Payment link created</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center leading-tight mb-4">Your payment link has been created!<br />Now you can share it with someone.</div>
        <div class="successLinkContainer">
          <zk-input ref="linkInput" size="sm" :value="paymentLink" readonly @click="$refs.linkInput.focus()" />
          <zk-defbtn id="copy-link" v-popover:copy-link.bottom @click="copyLink()">
            <span>Copy</span>
            <i class="fal fa-clipboard" />
          </zk-defbtn>
          <zk-defbtn outline square @click="twitterShare()">
            <i class="fab fa-twitter" />
          </zk-defbtn>
          <zk-defbtn outline square @click="facebookShare()">
            <i class="fab fa-facebook-f" />
          </zk-defbtn>
          <popover name="copy-link" event="click" class="text-center block text-xs" :delay="100"> Link copied! </popover>
        </div>
      </template>
      <template slot="footer">
        <div class="flex items-center justify-center flex-wrap">
          <zk-defbtn class="mr-3" :disabled="previewLoading" outline @click="successModal = false">
            <i class="far fa-arrow-left" />
            <span>Close</span>
          </zk-defbtn>
          <zk-defbtn :loader="previewLoading" :to="`/link/${paymentHash}`" @click.native="previewLoading = true">
            <span>Try now</span>
            <i v-if="!previewLoading" class="far fa-arrow-right" />
          </zk-defbtn>
        </div>
      </template>
    </zk-modal>

    <div class="linkHeader">
      <nuxt-link to="/link" class="flex items-stretch justify-center">
        <img src="@/static/images/logo.png" class="head-logo" alt="Checkout by RIF Rollup" />
        <div class="brandContainer text-violet -dark text-2xl font-bold flex flex-col lg:flex-row items-end md:items-start md:gap-2 mr-5 lg:justify-start leading-1">
          <h1 class="leading-1 -mb-1 lg:m-0 w-auto">Checkout</h1>
          <span v-if="!isMainnet" class="networkName text-sm font-light"> {{ currentNetwork }}</span>
        </div>
      </nuxt-link>
      <ul
        v-if="!showAddLink"
        class="feature-list zk-container font-light text-dark mt-4 mr-auto ml-auto mb-6 text-sm md:text-md flex-col items-center text-gray-600 dark:text-gray-100">
        <li class="flex-grow headline big text-violet mb-3">Get paid in tokens with RIF Rollup:</li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2" />
          <span>Blazing-fast & cost efficient</span>
        </li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2" />
          <span>Permissionless visual link builder</span>
        </li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2" />
          <span>Up to {{ maxPayments }} transactions with different recipients</span>
        </li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2" />
          <span><a href="https://zksync.io/api/sdk/checkout/" CLASS="lightLink" target="_blank">RIF Rollup Checkout SDK</a>&nbsp;for the fully-featured checkout</span>
        </li>
        <li class="mb-3">
          <i class="fad fa-check text-violet mr-2" />
          <span>Up to 70 transaction with customizable description & purpose using SDK</span>
        </li>
      </ul>
    </div>
    <div ref="paymentsContainer" class="linkBody py-4 md:py-10">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <h2 class="mx-auto text-center zk-container headline big text-violet mb-3" v-html="createLinkBlockTitle" />
      <zk-defbtn v-if="!showAddLink" class="mx-auto mt-5" big @click="enableLink()">Try it now</zk-defbtn>
      <template v-if="showAddLink">
        <div v-for="index in payments.keys()" :key="index" class="paymentContainer w-full py-2 md:py-1">
          <payment-item v-model="payments[index]" :display-index="payments.length >= 2" :display-delete="payments.length >= 2" :index="index" @delete="deletePayment(index)" />
        </div>
      </template>
      <zk-defbtn v-if="showAddLink" outline class="mx-auto mt-5" :disabled="payments.length >= maxPayments" @click="addPayment()">Add another transaction</zk-defbtn>
      <div v-if="showAddLink" class="text-gray text-sm text-center leading-tight pt-2" :class="{ 'text-dark': payments.length >= maxPayments }">
        {{ payments.length >= 5 ? `${payments.length}/` : "Up to " }}{{ maxPayments }} transactions
      </div>
    </div>
    <div class="linkFooter filter rounded-b px-5">
      <zk-max-height v-show="payments.length < 3" :value="!validConfig && showAddLink" class="mt-0 md:mt-5 md:mt-7 zk-container mx-auto">
        <div>
          <zk-note class="notificationNote">
            <template slot="icon">
              <i class="text-gray text-xl fal fa-info-square" />
            </template>
            <template slot="default">
              <div class="text-sm text-gray font-light">
                To unlock <span class="font-normal">“Build your payment link”</span> button below make sure to fill-up <span class="font-normal">“Receiver ETH address”</span> and
                <span class="font-normal">“Amount”</span> {{ payments.length > 1 ? `for each of ${payments.length} transactions` : `of the transaction` }}.
              </div>
            </template>
          </zk-note>
        </div>
      </zk-max-height>
      <zk-defbtn v-if="showAddLink" class="mx-auto mt-5 md:mt-5 shadow-sm" :outline="!validConfig" :disabled="!validConfig" big @click="generate()"
      >Build your payment link</zk-defbtn
      >
      <div class="poweredBy pt-5 md:pt-10 pb-0 md:pb-5 flex items-center justify-between">
        <block-footer :full-footer-menu="true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Network } from "@rsksmart/rif-rollup-js-sdk/build/types";
import { copyToClipboard } from "@rsksmart/rif-rollup-nuxt-core/utils";
import { FACEBOOK_URL, TWEET_URL } from "@/plugins/build";
import { encrypt } from "@/plugins/link";
import { checkAddress } from "@/plugins/utils";
import { PaymentItem } from "@/types";

export default Vue.extend({
  layout: "link",
  data() {
    return {
      addLinkMode: false,
      payments: [] as PaymentItem[],
      wrongDataModal: false,
      successModal: false,
      previewLoading: false,
      paymentHash: "",
      maxPayments: 20,
    };
  },
  computed: {
    currentNetwork(): Network {
      return this.$store.getters["zk-provider/network"];
    },
    isMainnet(): boolean {
      return this.currentNetwork === "mainnet";
    },
    paymentLink(): string {
      return window.location.origin + "/link/" + this.paymentHash;
    },
    showAddLink(): boolean {
      return this.addLinkMode;
    },
    createLinkBlockTitle(): string {
      const ethNetwork = this.isMainnet ? "" : `<strong>${this.currentNetwork}</strong>`;
      return this.showAddLink ? `Compose batch of your ${ethNetwork} payments:` : `Build instant ${ethNetwork} payout link in 5 min`;
    },
    validConfig(): boolean {
      if (this.payments.length < 1) {
        return false;
      }
      for (const payment of this.payments) {
        if ((!this.isValidDomain(payment.address, payment.token) && !checkAddress(payment.address)) || !payment.amount) {
          return false;
        }
      }
      return true;
    },
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
        token,
      });
      this.getDomainAddress(address, token);
    },
    enableLink() {
      this.addLinkMode = true;
      this.addPayment();
    },
    generate() {
      for (const payment of this.payments) {
        if (!payment.address || !payment.amount) {
          return (this.wrongDataModal = true);
        }
      }
      this.paymentHash = encrypt(this.payments);
      this.successModal = true;
    },
    copyLink() {
      copyToClipboard(this.paymentLink);
    },
    twitterShare() {
      window.open(`${TWEET_URL}${encodeURIComponent(this.paymentLink)}`, "_blank");
    },
    facebookShare() {
      window.open(`${FACEBOOK_URL}${encodeURIComponent(this.paymentLink)}`, "_blank");
    },
    isValidDomain(address: string, token: string): boolean {
      return (this as any).$domainResolver.isValidAddress(address, token);
    },
    async getDomainAddress(currentAddress: string, token: string) {
      if (!this.isValidDomain(currentAddress, token)) {
        await (this as any).$domainResolver.lookupDomain(currentAddress, token);
      }
    },
  },
});
</script>
