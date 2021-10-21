<template>
  <div class="paymentItem flex flex-col md:flex-row md:justify-between lg:items-start">
    <transition name="fade">
      <div class="index bg-white3 rounded-full text-gray text-sm desktopOnly" v-if="displayIndex">{{ index+1 }}</div>
    </transition>
    <transition name="fade">
      <div class="delete rounded-full text-gray text-sm cursor-pointer" @click="$emit('delete')" v-if="displayDelete">
        <i class="fal fa-times"/>
      </div>
    </transition>
    <div class="w-full">
      <div class="label text-sm text-light"><strong class="mobileOnly">Txn #{{ index + 1 }}:&nbsp;</strong>Receiver ETH address</div>
      <address-input v-model="valNow.address" />
    </div>
    <div class="md:pl-4 w-full md:w-auto">
      <div class="label text-sm text-light desktopOnly">&nbsp;</div>
      <div class="tokenDropdown w-full md:w-64" :class="{'opened': dropdownOpened}">
        <div class="dropdownMain flex items-center justify-between border border-light rounded px-3">
          <div class="flex items-center pr-4 cursor-pointer select-none" @click="dropdownOpened=!dropdownOpened">
            <div class="font-bold text-lg pr-2 whitespace-no-wrap">{{ valNow.token }}</div>
            <i class="text-gray fal fa-angle-down"></i>
          </div>
          <amount-input :token="valNow.token" type="transfer" v-model="valNow.amount" />
        </div>
        <div ref="dropdownBody" tabindex="0" class="dropdownBody border border-light rounded pb-2" v-if="dropdownOpened">
          <div class="searchField px-3 pb-2">
            <zk-input class="bg-white" v-model="dropdownSearch" size="sm" :maxlength="10" placeholder="Search for token">
              <template slot="icon">
                <i class="fal fa-search"></i>
              </template>
            </zk-input>
          </div>
          <div class="tokensList">
            <div @click="setToken(item)" class="tokenItem py-1 px-3 text-lg cursor-pointer flex justify-between items-center" v-for="(item, prop) in displayedTokens" :key="prop">
              <div>{{ item.symbol }}</div>
              <i class="text-gray fal fa-check" v-if="item.symbol === valNow.token"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Tokens } from "zksync/build/types";
import { Token } from "matter-dapp-module/types";
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
      valNow: this.value,
      dropdownOpened: false,
      dropdownSearch: "",
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.valNow = val;
      }
    },
    valNow: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      }
    },
    dropdownOpened(val) {
      if(val===true) {
        this.$nextTick(()=>{
          (this.$refs.dropdownBody as HTMLElement)?.querySelector('input')?.focus();
        });
      }
    },
    focused(val) {
      if(val===false) {
        this.dropdownOpened = false;
      }
    },
  },
  computed: {
    tokens: function(): Tokens {
      return this.$store.getters["zk-tokens/zkTokens"];
    },
    displayedTokens: function(): Tokens {
      let result = {}, key;
      for (key in this.tokens) {
        if (this.tokens.hasOwnProperty(key) && this.tokens[key].symbol.toLowerCase().includes(this.dropdownSearch.toLowerCase())) {
          result[key] = this.tokens[key];
        }
      }
      return result;
    },
  },
  methods: {
    setToken(token: Token) {
      this.$set(this.valNow, 'token', token.symbol);
      this.dropdownOpened = false;
      this.dropdownSearch = "";
    },
  },
});
</script>
