<template>
  <div class="allModalsContainer">
    <modal v-if="currentModal === 'wrongAccountAddress'" :value="true" @close="closeModal()">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"></i>
          <div>Wrong account address</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-center">
          The website that initiated the checkout, expects you to be logged in to the following account: <b>{{ transactionData.fromAddress }}</b>
        </div>
      </template>
    </modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TransactionData } from "@/plugins/types";

export default Vue.extend({
  computed: {
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