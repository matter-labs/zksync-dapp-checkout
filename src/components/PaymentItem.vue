<template>
  <div class="paymentItem flex flex-col md:flex-row md:justify-between lg:items-start">
    <transition name="fade">
      <div class="index bg-white3 rounded-full text-gray text-sm desktopOnly" v-if="displayIndex">{{ index + 1 }}</div>
    </transition>
    <transition name="fade">
      <div class="delete rounded-full text-gray text-sm cursor-pointer" @click="$emit('delete')" v-if="displayDelete">
        <i class="fal fa-times" />
      </div>
    </transition>
    <div class="w-full">
      <div class="label text-sm text-light"><strong class="mobileOnly">Txn #{{ index + 1 }}:&nbsp;</strong>Receiver ETH address</div>
      <address-input v-model="valNow.address" />
    </div>
    <div class="md:pl-4 w-full md:w-auto">
      <div class="label text-sm text-light desktopOnly">&nbsp;</div>
      <div class="tokenDropdown w-full md:w-64" :class="{'opened': dropdownOpened, 'focused': isDropdownFocused}" v-click-outside="unFocused">
        <div class="dropdownMain flex items-center justify-between border border-light rounded px-3">
          <div class="flex items-center pr-4 cursor-pointer select-none" @mouseup="focusedOnDropdown">
            <div class="font-bold text-lg pr-2 whitespace-no-wrap">{{ valNow.token }}</div>
            <i class="text-gray fal" :class="[{'fa-angle-down': !dropdownOpened}, {'fa-angle-up': dropdownOpened}]" />
          </div>
          <amount-input :token="valNow.token" type="transfer" v-model="valNow.amount" ref="amountInput" @focusout.native="unFocused" @focusin.native="focusedOnAmount" />
        </div>
        <div ref="dropdownBody" tabindex="0" class="dropdownBody border border-light rounded pb-2" v-if="dropdownOpened">
          <div class="searchField px-3 pb-2">
            <zk-input class="bg-white" v-model="dropdownSearch" size="sm" :maxlength="10" placeholder="Search for token" @keyup.native="enter">
              <template slot="icon">
                <i class="fal fa-search" />
              </template>
            </zk-input>
          </div>
          <div class="tokensList">
            <div @click="setToken(item, index)" class="tokenItem py-1 px-3 text-lg cursor-pointer flex justify-between items-center" :class="{selected: selectedToken ===
            index}" v-for="(item, index) in displayedTokens" :key="index">
              <div>{{ item.symbol }}</div>
              <i class="text-gray fal fa-check" v-if="item.symbol === valNow.token" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ZKIPaymentItem, ZKISingleToken, ZkTokens } from "@/types";
import { Address } from "zksync/build/types";

// @ts-ignore
import vClickOutside from "v-click-outside";

export default Vue.extend({
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    displayDelete: {
      type: Boolean,
      default: false,
      required: false
    },
    displayIndex: {
      type: Boolean,
      default: false,
      required: false
    },
    index: {
      type: Number,
      default: 0,
      required: false
    },
    value: {
      type: Object,
      default: (): ZKIPaymentItem => ({
        address: <Address>"",
        amount: "",
        token: "ETH"
      }),
      required: false
    } as PropOptions<ZKIPaymentItem>
  },
  data() {
    return {
      valNow: <ZKIPaymentItem>this.value,
      dropdownOpened: <boolean>false,
      dropdownSearch: <string>"",
      isDropdownFocused: <boolean>false,
      selectedToken: <number>0
    };
  },
  computed: {
    displayedTokens(): ZKISingleToken[] {
      let result: ZKISingleToken[] = [];
      for (const key in this.tokens) {
        if (this.tokens.hasOwnProperty(key)) {
          if (this.dropdownSearch && !this.tokens[key].symbol.toLowerCase().includes(this.dropdownSearch.toLowerCase())) {
            continue;
          }
          result.push(this.tokens[key] as ZKISingleToken);
        }
      }
      return result;
    },
    tokens(): ZkTokens {
      return this.$store.getters["zk-tokens/zkTokens"] as ZkTokens;
    }
  },
  mounted() {
    this.value.address = (this.$store.getters["zk-account/address"] || "") as Address;
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
        this.$emit("input", val);
      }
    },
    dropdownOpened(val) {
      if (val===true) {
        this.$nextTick(() => {
          (this.$refs.dropdownBody as HTMLElement)?.querySelector("input")?.focus();
        });
      }
    },
    focused(val:boolean): void {
      if (!val) {
        this.dropdownOpened = false;
      }
    },
  },
  methods: {
    enter(event: KeyboardEvent): Event | KeyboardEvent | false {
      if (event.key==="Enter") {
        event.stopPropagation();
        this.setToken(this.displayedTokens[this.selectedToken], this.selectedToken);
        return false;
      }
      if (event.key==="ArrowDown") {
        event.stopPropagation();
        if (this.selectedToken < (this.displayedTokens.length - 1)) {
          this.selectedToken++;
        }
        return false;
      }
      if (event.key==="ArrowUp") {
        event.stopPropagation();
        if (this.selectedToken > 0) {
          this.selectedToken--;
        }
        return false;
      }
      return event;
    },
    setToken(token: ZKISingleToken, index: number = 0): void {
      if(token) {
        this.$set(this.valNow, "token", token.symbol);
        this.selectedToken = index;
      }
      this.dropdownSearch = "";
      this.dropdownOpened = false;
      this.isDropdownFocused = true;
    },
    focusedOnAmount(): void {
      this.dropdownOpened = false;
      this.isDropdownFocused = true;
    },
    focusedOnDropdown(event: Event): boolean | Event {
      event.preventDefault();
      this.dropdownOpened = true;
      this.isDropdownFocused = true;
      return false;
    },
    unFocused(): void {
      this.dropdownOpened = false;
      this.isDropdownFocused = false;
    }
  }
});
</script>