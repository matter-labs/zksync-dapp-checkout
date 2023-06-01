<template>
  <div class="allModalsContainer">
    <zk-modal :value="currentModal === 'wrongAccountAddress'" @close="closeModal()">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
          <div>Wrong account address</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center">
          The website that initiated the checkout, expects you to be logged in to the following account:
          <b>{{ transactionData.fromAddress }}</b>
        </div>
      </template>
    </zk-modal>
    <zk-modal :value="currentModal === 'zkLinkParseFail'" @close="closeModal()">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
          <div>Failed to parse link</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center">We failed to parse link checkout data. Try again later or try to use another link.</div>
      </template>
    </zk-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TransactionData } from "@/types";

export default Vue.extend({
  computed: {
    href(): string {
      return window.location.hostname;
    },
    currentModal() {
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
