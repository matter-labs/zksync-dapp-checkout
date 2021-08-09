<template>
  <div class="addressInput">
    <zk-input
      v-model="inputtedWallet"
      class="walletAddress"
      :maxlength="45"
      :error="!!error"
      placeholder="0x address"
      type="text"
    />
    <div class="errorTextContainer">
      <transition name="fadeFast">
        <div v-if="error" class="errorText text-xs text-red text-left">{{ error }}</div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import utils from "@/plugins/utils";
import { DecimalBalance } from "@/types";
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: "",
      required: false,
    } as PropOptions<DecimalBalance>,
  },
  data() {
    return {
      inputtedWallet: this.value ?? "",
    };
  },
  computed: {
    isValid(): boolean {
      return utils.validateAddress(this.inputtedWallet) && this.inputtedWallet.startsWith("0x");
    },
    error(): string {
      if (this.inputtedWallet && !this.isValid) {
        if(!this.inputtedWallet.startsWith("0x")) {
          return "Address should start with '0x'";
        }
        return "Invalid address";
      } else {
        return "";
      }
    },
  },
  watch: {
    inputtedWallet(val) {
      const trimmed = val.trim();
      this.inputtedWallet = trimmed;
      if (val !== trimmed) {
        return;
      }
      this.$emit("input", this.isValid ? val : "");
    },
    value(val) {
      if (this.isValid || (!this.isValid && !!val)) {
        this.inputtedWallet = val;
      }
    },
  },
});
</script>
