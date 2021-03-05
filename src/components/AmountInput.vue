<template>
  <div :class="[{'hasUnderInput': $slots['underInput']},{'disabled': disabled},{'focused': focused}]" class="amountInputGroup border rounded">
    <div class="leftSide" @click="focusInput()">
      <div class="inputContainer">
        <input ref="input" v-model="valNow" :disabled="disabled" :style="{'width': `${width}px`}" placeholder="Amount" type="text" @blur="focused=false" @focus="focused=true">
        <span ref="sizeSpan" class="sizeSpan">{{ valNow }}</span>
        <label for class="penIcon">
          <i class="fad fa-pen"/>
        </label>
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

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      valNow: this.value,
      focused: false,
      width: 0,
    };
  },
  watch: {
    valNow: {
      immediate: true,
      handler(val) {
        if (typeof val === "string") {
          this.valNow = val.trim();
        }
        setTimeout(() => {
          this.$nextTick(() => {
            this.calcWidth();
          });
        }, 0);
      },
    },
  },
  methods: {
    focusInput() {
      if (this.disabled || this.focused) {
        return;
      }
      this.$refs.input.focus();
    },
    calcWidth() {
      const sizeSpan = this.$refs.sizeSpan;
      if (!sizeSpan) {
        return;
      }
      this.width = sizeSpan.getBoundingClientRect().width;
    },
  },
};
</script>
