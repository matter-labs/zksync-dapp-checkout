<template>
  <div class="amountInputGroup border rounded" :class="[{'hasUnderInput': $slots['underInput']},{'disabled': disabled},{'error': error},{'focused': focused}]" @click.self="focusInput()">
    <div class="leftSide" @click="focusInput()">
      <div class="inputContainer">
        <input ref="input" :style="{'width': `${width}px`}" :disabled="disabled" type="text" placeholder="Amount" maxlength="12" v-model="inputtedAmount" @focus="focused=true" @blur="focused=false" @keyup.enter="$emit('enter')">
        <span class="sizeSpan" ref="sizeSpan">{{inputtedAmount}}</span>
        <div class="penIcon">
          <i class="fad fa-pen"></i>
        </div>
      </div>
      <div class="underInput">
        <slot name="underInput"/>
      </div>
    </div>
    <div class="rightSide">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import utils from "@/plugins/utils";

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: "",
      required: false,
    },
    type: {
      type: String,
      default: "",
      required: false,
    },
    maxAmount: {
      type: String,
      default: "",
      required: false,
    },
    token: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      inputtedAmount: this.value ? this.value : "",
      error: "",
      focused: false,
      width: 0,
    }
  },
  watch: {
    inputtedAmount: {
      immediate: true,
      handler(val) {
        let strVal = val;
        if(typeof(val)==='string') {
          strVal = strVal.trim().replace(/,/g,'.');
          let dotParts = strVal.split('.');
          if(dotParts.length>2) {
            strVal = `${dotParts[0]}.${dotParts.splice(1, dotParts.length).join('')}`;
          }
          this.inputtedAmount = strVal;
        }
        setTimeout(() => {
          this.$nextTick(() => {
            this.calcWidth();
          });
        }, 0);
        this.emitValue(strVal);
      }
    },
    token: {
      deep: true,
      handler() {
        if (!this.inputtedAmount) {
          return;
        }
        this.emitValue(this.inputtedAmount);
      },
    },
    maxAmount: {
      deep: true,
      handler() {
        if (!this.inputtedAmount) {
          return;
        }
        this.emitValue(this.inputtedAmount);
      },
    },
    value(val) {
      if (!this.error || (this.error && !!val)) {
        this.inputtedAmount = val;
      }
    },
  },
  methods: {
    emitValue: function (val: string): void {
      const trimmed = val.trim();
      this.inputtedAmount = trimmed;
      if (val !== trimmed) {
        return;
      }
      this.validateAmount(val);
      if (!this.error) {
        this.$emit("input", val);
      } else {
        this.$emit("input", "");
      }
    },
    validateAmount: function (val: string): void {
      if (!val || !parseFloat(val as string)) {
        this.error = "Wrong amount inputted";
        return;
      }
      if (!this.token) {
        this.error = "";
        return;
      }

      let inputAmount = null;
      try {
        inputAmount = utils.parseToken(this.token.symbol, val);
      } catch (error) {
        let errorInfo = `Amount processing error. Common reason behind it — inaccurate amount. Try again paying attention to the decimal amount number format — it should help`;
        if (error.message && error.message.search("fractional component exceeds decimals") !== -1) {
          errorInfo = `Precision exceeded: ${this.token.symbol} doesn't support that many decimal digits`;
        }
        this.error = errorInfo;
        return;
      }

      if (inputAmount.lte(0)) {
        this.error = "Wrong amount inputted";
        return;
      }

      if (this.maxAmount) {
        if (inputAmount.gt(this.maxAmount)) {
          this.error = `Not enough ${this.token.symbol} to ${this.type} requested amount`;
          return;
        }
      }

      if (this.type === "transfer" && !utils.isAmountPackable(inputAmount.toString())) {
        this.error = "Max supported precision for transfers exceeded";
        return;
      }
      this.error = "";
    },

    /* Misc */
    focusInput: function(): void {
      if (this.disabled || this.focused) {
        return;
      }
      (this.$refs.input as HTMLElement).focus();
    },
    calcWidth: function(): void {
      var sizeSpan = this.$refs.sizeSpan;
      if(!sizeSpan){return}
      let inputSize = (sizeSpan as HTMLElement).getBoundingClientRect().width;
      this.width = inputSize+4;
    },
  },
});
</script>
