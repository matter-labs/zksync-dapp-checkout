<template>
  <div class="allModalsContainer">
    <modal v-if="currentModal === 'wrongAccountAddress'" :value="true" @close="closeModal()">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
          <div>Wrong account address</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center">
          The website that initiated the checkout, expects you to be logged in to the following account: <b>{{ transactionData.fromAddress }}</b>
        </div>
      </template>
    </modal>
    <modal v-if="currentModal === 'noCheckoutData'" :value="true" :not-closable="true">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
          <div>No checkout data</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center">
          zkCheckout is working with the pre-configured checkout data. If you're trying to access the url <b>{{ href }}</b> directly, use
          <a href="https://link.zksync.io" class="lightLink" target="_blank">zkLink</a> first.
        </div>
      </template>
    </modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TransactionData } from "@/types/index";

export default Vue.extend({
  computed: {
    href(): string {
      return window.location.hostname;
    },
    currentModal() {
      console.log(this.$store.getters.currentModal);
      return this.$store.getters.currentModal;
    },
    transactionData(): TransactionData {
      return this.$store.getters["checkout/getTransactionData"];
    },
  },
  methods: {
    closeModal() {
      this.$store.dispatch("closeActiveModal");
    },
  },
});
</script>
