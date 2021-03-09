<template>
  <div class="w-full transactionTokenContainer">
    <!-- Modals -->
    <modal :value="modal==='insufficientL1Deposit' || modal==='insufficientL1Min'" @close="modal=''">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"></i>
          <div>Insufficient funds in the on-chain wallet to deposit</div>
        </div>
      </template>
      <template slot="default">
        <div v-if="modal==='insufficientL1Deposit'" class="text-sm">On-chain wallet has insufficient funds to deposit <b>{{ depositBigNumber | formatTokenPretty(token) }} {{
            token
          }}</b> to zkSync L2 account. Your on-chain balance is <b class="cursor-pointer"
                                                                   @click="setDepositMaxAmount();modal='';">{{ initialBalance.rawBalance | formatTokenPretty(token) }} {{
            token
          }}</b>.
        </div>
        <div v-else-if="modal==='insufficientL1Min'" class="text-sm"><b>{{ depositBigNumber | formatTokenPretty(token) }} {{ token }}</b> will not be enough to commit the
          transaction. The minimal amount is:
        </div>
        <values-block class="mt-3 cursor-pointer" @click="setDepositMinAmount(); modal=''">
          <template slot="left-top">
            <div class="headline">Minimal amount to deposit</div>
          </template>
          <template slot="right-top">
            <div class="flex md:flex-col whitespace-nowrap">
              <div class="value mr-2 md:mr-0">{{ needToDeposit | formatToken(token) }} {{ token }}</div>
              <div class="secondaryValue">{{ needToDeposit | formatUsdAmount(tokensPrices[token] && tokensPrices[token].price, token) }}</div>
            </div>
          </template>
        </values-block>
      </template>
    </modal>
    <modal :value="modal==='customError'" @close="modal=''">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"></i>
          <div>{{ errorModal.headline }}</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm">{{ errorModal.text }}</div>
      </template>
    </modal>


    <!-- Main -->
    <line-block>
      <template slot="first">
        <div class="tokenItem">
          <!-- <img src="/tokens/btc.svg" alt="BTC" class="tokenImg"> -->
          <div class="tokenName">{{ token }}</div>
        </div>
      </template>
      <template slot="second">
        <div class="amount">{{ total | formatToken(token) }}</div>
      </template>
      <template slot="third">
        <div class="amount"><span :class="enoughZkBalance===false?'text-red':'text-green'">{{ zkBalance.rawBalance | formatTokenPretty(token) }}</span></div>
      </template>
      <template v-if="step==='default'">
        <template v-if="enoughZkBalance" slot="right">
          <success-mark class="w-8 h-8"/>
        </template>
        <template v-else slot="right">
          <div v-if="!enoughWithInitialBalance && initialBalance.unlocked" class="text-red text-xs font-medium">Insufficient {{ token }} mainnet balance</div>
          <defbtn v-else-if="!enoughWithInitialBalance && !initialBalance.unlocked" @click="unlock()"><i class="fas fa-unlock-alt"></i><span>Unlock</span></defbtn>
          <amount-input v-else ref="amountInput" v-model="depositAmount" :token="token" type="deposit" :class="{'error': !enoughDepositAmount}">
            <template slot="default">
              <defbtn v-if="initialBalance.unlocked===true" @click="deposit()"><i class="fal fa-arrow-to-right"></i><span>Deposit</span></defbtn>
              <defbtn v-else @click="unlock()"><i class="fas fa-unlock-alt"></i><span>Unlock</span></defbtn>
            </template>
          </amount-input>
        </template>
      </template>
      <template v-else-if="step==='depositing'">
        <template slot="right">
          <div v-if="substep==='waitingUserConfirmation'" class="flex items-center">
            <div class="text-gray text-xs font-medium">Confirm the deposit</div>
          </div>
          <div v-else-if="substep==='committing' || substep==='confirming'" class="flex items-center">
            <div class="text-gray text-xs font-medium mr-2">{{ substep === "committing" ? "Committing transaction" : "Confirming transaction" }}...</div>
            <loader color="gray" size="sm"/>
          </div>
        </template>
      </template>
      <template v-else-if="step==='unlocking'">
        <template slot="right">
          <div v-if="substep==='waitingUserConfirmation'" class="flex items-center">
            <div class="text-gray text-xs font-medium">Confirm the transaction</div>
          </div>
          <div v-else-if="substep==='committing'" class="flex items-center">
            <div class="text-gray text-xs font-medium mr-2">Committing transaction...</div>
            <loader color="gray" size="sm"/>
          </div>
        </template>
      </template>
    </line-block>
  </div>
</template>

<script lang="ts">
import { Address, Balance, GweiBalance, TokenPrices } from "@/plugins/types";
import utils from "@/plugins/utils";
import { deposit, unlockToken } from "@/plugins/walletActions/transaction";
import { BigNumber } from "ethers";
import Vue from "vue";

export default Vue.extend({
  props: {
    token: {
      type: String,
      default: "",
      required: true,
    },
    total: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      modal: "",
      errorModal: {
        headline: "",
        text: "",
      },
      step: "default" /* default, depositing, unlocking */,
      substep: "" /* depositing: [waitingUserConfirmation,depositing,committing], unlocking: [waitingUserConfirmation,committing,confirming] */,
      depositAmount: "",
    };
  },
  computed: {
    tokensPrices(): TokenPrices {
      return this.$store.getters["tokens/getTokenPrices"];
    },
    zkBalance(): Balance {
      return this.$store.getters["wallet/getzkBalances"].find((e: Balance) => e.symbol === this.token);
    },
    initialBalance(): Balance {
      return this.$store.getters["wallet/getInitialBalances"].find((e: Balance) => e.symbol === this.token);
    },
    depositBigNumber(): GweiBalance {
      if (!this.depositAmount) {
        return "";
      }
      try {
        return utils.parseToken(this.token, this.depositAmount).toString();
      } catch (error) {
        return "";
      }
    },
    needToDeposit(): GweiBalance {
      try {
        return BigNumber.from(this.total).sub(this.zkBalance.rawBalance).toString();
      } catch (error) {
        return "";
      }
    },
    enoughZkBalance(): Boolean {
      return BigNumber.from(this.zkBalance.rawBalance).gte(this.total);
    },

    /**
     * Returns (L1+L2 balance >= Total to pay)
     */
    enoughWithInitialBalance(): Boolean {
      return BigNumber.from(this.zkBalance.rawBalance).add(BigNumber.from(this.initialBalance.rawBalance)).gte(this.total);
    },

    /**
     * Returns (Inputted deposit amount >= L1 Balance)
     */
    enoughOnInitialToDeposit(): Boolean {
      if (!this.depositAmount) {
        return true;
      }
      try {
        const depositAmountBigNumber = BigNumber.from(this.depositBigNumber);
        return !depositAmountBigNumber.gt(BigNumber.from(this.initialBalance.rawBalance));
      } catch (error) {
        return false;
      }
    },

    /**
     * Returns (Inputted deposit amount >= Total to pay - L2 balance)
     */
    enoughDepositAmount(): Boolean {
      if (!this.depositAmount) {
        return true;
      }
      try {
        const depositAmountBigNumber = BigNumber.from(this.depositBigNumber);
        return depositAmountBigNumber.gte(BigNumber.from(this.needToDeposit));
      } catch (error) {
        return false;
      }
    },
  },
  watch: {
    enoughZkBalance: {
      immediate: true,
      handler(val) {
        if (val === true && this.step === "default") {
          this.$emit("input", true);
        } else {
          this.$emit("input", false);
        }
      },
    },
    step(val) {
      this.$emit("input", this.enoughZkBalance && val === "default");
    },
  },
  mounted() {
    if (!this.enoughZkBalance) {
      this.setDepositMinAmount();
    }
  },
  methods: {
    setDepositMaxAmount() {
      this.depositAmount = utils.handleFormatToken(this.token, this.initialBalance.rawBalance.toString());
    },
    setDepositMinAmount() {
      this.depositAmount = utils.handleFormatToken(this.token, this.needToDeposit);
    },
    async deposit() {
      if (!this.enoughOnInitialToDeposit) {
        this.modal = "insufficientL1Deposit";
      } else if (!this.enoughDepositAmount) {
        this.modal = "insufficientL1Min";
      } else if (this.$refs && this.$refs.amountInput && (this.$refs.amountInput as Vue).$data.error) {
        this.modal = "customError";
        this.errorModal = {
          headline: `Inputed ${this.token} amount error`,
          text: (this.$refs.amountInput as Vue).$data.error,
        };
      } else {
        try {
          this.substep = "waitingUserConfirmation";
          this.step = "depositing";
          const transferTransaction = await deposit(this.token, this.depositBigNumber, this.$store);
          this.substep = "committing";
          await transferTransaction.awaitEthereumTxCommit();
          this.substep = "confirming";
          await transferTransaction.awaitReceipt();
          await this.$store.dispatch("wallet/getzkBalances", { accountState: undefined, force: true });
          this.step = "default";
        } catch (error) {
          this.step = "default";
          const createErrorModal = (text: string) => {
            this.errorModal = {
              headline: `Depositing ${this.token} error`,
              text,
            };
          };
          if (error.message) {
            if (!error.message.includes("User denied")) {
              if (error.message.includes("Fee Amount is not packable")) {
                createErrorModal("Fee Amount is not packable");
              } else if (error.message.includes("Transaction Amount is not packable")) {
                createErrorModal("Transaction Amount is not packable");
              }
            }
          } else {
            createErrorModal("Unknow error. Try again later.");
          }
        }
      }
    },
    async unlock() {
      try {
        this.substep = "waitingUserConfirmation";
        this.step = "unlocking";
        const unlockTransaction = await unlockToken(this.initialBalance.address as Address, this.$store);
        this.substep = "committing";
        await unlockTransaction.wait();
        await this.$store.dispatch("wallet/getInitialBalances", true);
        this.step = "default";
      } catch (error) {
        this.step = "default";
        const createErrorModal = (text: string) => {
          this.errorModal = {
            headline: `Unlocking ${this.token} error`,
            text,
          };
        };
        if (error.message) {
          if (!error.message.includes("User denied")) {
            createErrorModal(error.message);
          }
        } else {
          createErrorModal("Unknow error. Try again later.");
        }
      }
    },
  },
});
</script>
