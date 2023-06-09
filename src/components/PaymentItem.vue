<template>
  <div class="paymentItem flex flex-col md:flex-row md:justify-between lg:items-start">
    <transition name="fade">
      <div v-if="displayIndex" class="index bg-white3 rounded-full text-gray text-sm desktopOnly">{{ index + 1 }}</div>
    </transition>
    <transition name="fade">
      <div v-if="displayDelete" class="delete rounded-full text-gray text-sm cursor-pointer" @click="$emit('delete')">
        <i class="fal fa-times" />
      </div>
    </transition>
    <div class="w-full">
      <div class="label text-sm text-light">
        <strong class="mobileOnly">Txn #{{ index + 1 }}:&nbsp;</strong>Receiver ETH address
      </div>
      <address-input ref="addressInput" v-model="valNow.address" :token="valNow.token" />
    </div>
    <div class="md:pl-4 w-full md:w-auto">
      <div class="label text-sm text-light desktopOnly">&nbsp;</div>
      <token-dropdown ref="tokenDropdown" v-model="valNow.token" class="w-full md:w-64">
        <amount-input ref="amountInput" v-model="valNow.amount" :token="valNow.token" type="transfer" @focusout.native="unFocused" @focusin.native="focusedOnAmount" />
      </token-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { PaymentItem } from "@/types";

export default Vue.extend({
  props: {
    value: {
      type: Object,
      default: () => ({
        address: "",
        amount: "",
        token: "ETH",
      }),
      required: false,
    } as PropOptions<PaymentItem>,
    index: {
      type: Number,
      default: 0,
      required: false,
    },
    displayIndex: {
      type: Boolean,
      default: false,
      required: false,
    },
    displayDelete: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      valNow: this.value as PaymentItem,
    };
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.valNow = val;
      },
    },
    valNow: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    focusedOnAmount(): void {
      // @ts-ignore
      (this.$refs.tokenDropdown as Vue)?.focusedOnAmount();
    },
    unFocused(): void {
      // @ts-ignore
      (this.$refs.tokenDropdown as Vue)?.blurOnAmount();
    },
  },
});
</script>
