<template>
  <div class="addressInput">
    <zk-input
      v-model="inputtedWallet"
      class="walletAddress"
      :maxlength="45"
      :error="!!error && !unsDomain"
      placeholder="0x address or domain"
      spellcheck="false"
      type="text"
      @input="getDomainAddress" />
    <div v-if="unsDomain" class="text-xs text-left flex">
      <img height="20" width="20" src="/UnsLogo.png" alt="Unstoppable Domains Logo" />
      {{ domainSubText }}
    </div>
    <div class="errorTextContainer">
      <transition name="fadeFast">
        <div v-if="error && !unsDomain" class="errorText text-xs text-red text-left">{{ error }}</div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { DecimalBalance } from "@rsksmart/rif-rollup-nuxt-core/types";
import { TokenSymbol } from "@rsksmart/rif-rollup-js-sdk/build/types";
import { checkAddress } from "@/plugins/utils";

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: "",
      required: false,
    } as PropOptions<DecimalBalance>,
    token: {
      type: String,
      default: "ETH",
      required: false,
    } as PropOptions<TokenSymbol>,
  },
  data() {
    return {
      inputtedWallet: this.value ?? "",
      resolvingUnsDomain: false,
      unsDomain: "",
    };
  },
  computed: {
    isValid(): boolean {
      return checkAddress(this.inputtedWallet) || this.isValidDomain;
    },
    error(): string {
      if (!this.resolvingUnsDomain && this.inputtedWallet && !this.isValid) {
        if (!this.inputtedWallet.startsWith("0x")) {
          return "Address should start with '0x'";
        }
        return "Invalid address";
      } else {
        return "";
      }
    },
    isValidDomain(): boolean {
      return !this.resolvingUnsDomain && (this as any).$domainResolver.isValidAddress(this.inputtedWallet, this.token);
    },
    getDomain(): string {
      return (this as any).$domainResolver.getDomain(this.inputtedWallet, this.token);
    },
    domainSubText(): string {
      const domain = this.unsDomain;
      return domain.substring(0, 6) + "..." + domain.substring(domain.length - 6, domain.length);
    },
  },
  watch: {
    inputtedWallet(val) {
      const trimmed = val.trim();
      this.inputtedWallet = trimmed;
      if (val !== trimmed) {
        return;
      }
      this.$emit("input", val);
    },
    value(val) {
      if (this.isValid || (!this.isValid && !!val)) {
        this.inputtedWallet = val;
      }
    },
    async token() {
      await this.getDomainAddress();
    },
  },
  mounted() {
    this.unsDomain = this.getDomain;
  },
  methods: {
    async getDomainAddress() {
      try {
        this.resolvingUnsDomain = true;
        this.unsDomain = "";
        if (!this.isValidDomain) {
          const currentAddress = this.inputtedWallet;
          const domainAddress = await (this as any).$domainResolver.lookupDomain(currentAddress, this.token);
          this.unsDomain = domainAddress;
        } else {
          this.unsDomain = this.getDomain;
        }
      } catch (error) {
        console.warn("Resolving UNS domain failed", error);
      } finally {
        this.resolvingUnsDomain = false;
      }
    },
  },
});
</script>
