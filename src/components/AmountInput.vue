<template>
  <div class="amountInputGroup border rounded" :class="[{'hasUnderInput': $slots['underInput']},{'disabled': disabled},{'error': error},{'focused': focused}]" @click.self="focusInput()">
    <div class="leftSide" @click="focusInput()">
      <div class="amInputContainer">
        <input
          ref="input"
          v-model="inputtedAmount"
          :style="{ width: `${width}px` }"
          :disabled="disabled"
          type="text"
          placeholder="Amount"
          maxlength="15"
          @focus="focused = true"
          @blur="focused = false"
          @keyup.enter="$emit('enter')"
        />
        <span ref="sizeSpan" class="sizeSpan">{{ inputtedAmount }}</span>
        <div class="penIcon">
          <i class="fad fa-pen" />
        </div>
      </div>
      <div class="underInput">
        <slot name="underInput" />
      </div>
    </div>
    <div class="rightSide">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {isTransactionAmountPackable} from "zksync/build/utils";

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
    token: {
      type: String,
      default: "",
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
    };
  },
  watch: {
    inputtedAmount: {
      immediate: true,
      handler(val) {
        let strVal = val;
        if (typeof val === "string") {
          strVal = strVal.trim().replace(/,/g, ".");
          const dotParts = strVal.split(".");
          if (dotParts.length > 2) {
            strVal = `${dotParts[0]}.${dotParts.splice(1, dotParts.length).join("")}`;
          }
          this.inputtedAmount = strVal;
        }
        setTimeout(() => {
          this.$nextTick(() => {
            this.calcWidth();
          });
        }, 0);
        this.emitValue(strVal);
      },
    },
    token() {
      if (!this.inputtedAmount) {
        return;
      }
      this.emitValue(this.inputtedAmount);
    },
    value(val) {
      if (!this.error || (this.error && !!val)) {
        this.inputtedAmount = val;
      }
    },
  },
  methods: {
    emitValue(val: string): void {
      const trimmed = val.trim();
      this.inputtedAmount = trimmed;
      if (val!==trimmed) {
        return;
      }
      this.validateAmount(val);
      this.$emit("input", this.error ? "":val);
    },
    validateAmount(val: string): void {
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
        inputAmount = this.$options.filters!.parseDecimal(val, this.token);
      } catch (error) {
        let errorInfo = "Amount processing error. Common reason behind it — inaccurate amount. Try again paying attention to the decimal amount number format — it should help";
        if ((error as Error).message && (error as Error).message.search("fractional component exceeds decimals")!== -1) {
          errorInfo = `Precision exceeded: ${this.token} doesn't support that many decimal digits`;
        }
        this.error = errorInfo;
        return;
      }

      if (inputAmount.lte(0)) {
        this.error = "Wrong amount inputted";
        return;
      }

      if (this.type==="transfer" && !isTransactionAmountPackable(inputAmount.toString())) {
        this.error = "Max supported precision for transfers exceeded";
        return;
      }
      this.error = "";
    },
    focusInput(): void {
      if (!this.disabled && !this.focused) {
        (this.$refs.input as HTMLElement)?.focus();
      }
    },
    calcWidth(): void {
      const sizeSpan = this.$refs.sizeSpan as Element;
      if (!sizeSpan || !(sizeSpan as HTMLElement).getBoundingClientRect().width) {
        return;
      }
      this.width = (sizeSpan as HTMLElement).getBoundingClientRect().width + 4;
    }
  }
});
</script>