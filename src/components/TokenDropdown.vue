<template>
  <v-popover class="tokenDropdown" :class="{'standalone': standalone}" :handle-resize="true" :boundaries-element="boundariesElement" offset="5" placement="bottom" :popover-base-class="['dropdownBody', standalone ? 'w-44' : '']" :open.sync="dropdownOpened" trigger="manual">
    <div class="dropdownMainContainer">
      <div class="dropdownMain flex items-center justify-between border border-light rounded px-2 md:px-3" :class="[{'opacity-50': disabled}, disabled ? 'cursor-default' : 'cursor-pointer']">
        <div class="flex items-center pr-4 select-none" @click="focusedOnDropdown">
          <div class="font-bold text-md md:text-lg pr-2 whitespace-nowrap">{{ value }}</div>
          <i class="text-gray fal" :class="[{ 'fa-angle-down': !dropdownOpened }, { 'fa-angle-up': dropdownOpened }]" />
        </div>
        <slot />
      </div>
    </div>
    <template slot="popover">
      <div ref="dropdownBody" class="dropdownBody border border-light rounded pb-2">
        <div class="searchField p-1 md:p-2">
          <zk-input v-model="dropdownSearch" class="bg-white" size="sm" :maxlength="10" placeholder="Search for token" @keyup.native="enter">
            <template slot="icon">
              <i class="fal fa-search" />
            </template>
          </zk-input>
        </div>
        <div class="tokensList">
          <div
            v-for="(item, index) in displayedTokens"
            :key="index"
            class="tokenItem py-1 px-2 md:px-3 text-md md:text-lg cursor-pointer flex justify-between items-center"
            :class="{ selected: selectedToken === index }"
            @click="setToken(item, index)"
          >
          <div>{{ item.symbol }}</div>
            <i v-if="item.symbol === value" class="text-gray fal fa-check" />
          </div>
        </div>
      </div>
    </template>
  </v-popover>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { ZkSingleToken, ZkTokens } from "@/types";
import { TokenSymbol } from "zksync/build/types";
import { ZkTokenBalances } from "@matterlabs/zksync-nuxt-core/types";

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: "ETH",
      required: false
    } as PropOptions<TokenSymbol>,
    disabled: {
      type: Boolean,
      default: false,
      required: false
    } as PropOptions<boolean>,
    feeAllowed: {
      type: Boolean,
      default: false,
      required: false
    } as PropOptions<boolean>,
    standalone: {
      type: Boolean,
      default: false,
      required: false
    } as PropOptions<boolean>,
  },
  data() {
    return {
      dropdownOpened: <boolean>false,
      dropdownSearch: <string>"",
      isDropdownFocused: <boolean>false,
      selectedToken: 0,
    };
  },
  watch: {
    displayedTokens: {
      deep: true,
      handler(tokens: ZkSingleToken[]) {
        if (tokens.filter((singleToken: ZkSingleToken) => this.value===singleToken.symbol).length===0) {
          this.selectedToken = 0;
        }
      }
    },
    dropdownOpened(val) {
      if (val===true) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        if (vw > 768) {
          this.$nextTick(() => {
            setTimeout(() => {
              (document.querySelector('.dropdownBody.open') as HTMLElement)?.querySelector("input")?.focus();
            }, 100);
          });
        }
      } else {
        this.dropdownSearch = "";
      }
    },
  },
  computed: {
    tokens(): ZkTokens {
      return this.$store.getters["zk-tokens/zkTokens"] as ZkTokens;
    },
    displayedTokens(): ZkSingleToken[] {
      let result: ZkSingleToken[] = [], key: string;
      for (key in this.tokens) {
        if (this.tokens.hasOwnProperty(key) && (!this.feeAllowed || (this.feeAllowed && this.tokens[key].enabledForFees))) {
          if (this.dropdownSearch && !this.tokens[key].symbol.toLowerCase().includes(this.dropdownSearch.toLowerCase())) {
            continue;
          }
          result.push(this.tokens[key] as ZkSingleToken);
        }
      }
      if (this.$store.getters["zk-account/loggedIn"]) {
        const balances: ZkTokenBalances = this.$store.getters["zk-balances/balances"];
        return result.sort((a,b) => Number(!!balances[b.symbol]) - Number(!!balances[a.symbol]));
      }
      return result;
    },
    boundariesElement(): HTMLElement {
      return window.document.body;
    }
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
    setToken(token: ZkSingleToken, index: number = 0): void {
      this.$emit("input", token.symbol);
      this.selectedToken = index;
      this.dropdownOpened = false;
      this.isDropdownFocused = true;
      this.dropdownSearch = "";
      if (this.$slots.default && this.$slots.default[0]) {
        (this.$slots.default[0]?.elm as HTMLElement)?.querySelector("input")?.focus();
      }
    },
    focusedOnDropdown(event: Event): boolean | Event {
      event.preventDefault();
      if (this.disabled) {return false}
      this.dropdownOpened = true;
      this.isDropdownFocused = true;
      return false;
    },

    /* Amount */
    focusedOnAmount(): void {
      this.dropdownOpened = false;
      this.isDropdownFocused = true;
    },
    blurOnAmount(): void {
      this.dropdownOpened = false;
      this.isDropdownFocused = false;
    }
  }
});
</script>