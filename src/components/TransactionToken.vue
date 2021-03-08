<template>
  <div class="w-full transactionTokenContainer">
    <!-- Modals -->
    <modal :value="modal==='insufficientL1' || modal==='insufficientL1Deposit' || modal==='insufficientL1Min'" @close="modal=''">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"></i>
          <div>Insufficient funds in the on-chain wallet to deposit</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm" v-if="modal==='insufficientL1'">On-chain wallet has insufficient funds to deposit minimal amount to zkSync L2 account. Top up your on-chain wallet with minimal amount:</div>
        <div class="text-sm" v-else-if="modal==='insufficientL1Deposit'">On-chain wallet has insufficient funds to deposit <b>{{ depositBigNumber | formatTokenPretty(token) }} {{ token }}</b> to zkSync L2 account.</div>
        <div class="text-sm" v-else-if="modal==='insufficientL1Min'"><b>{{ depositBigNumber | formatTokenPretty(token) }} {{ token }}</b> will not be enough to commit the transaction. The minimal amount is:</div>
        <values-block class="mt-3 cursor-pointer" @click="setDepositMinAmount(); modal=''">
          <template slot="left-top">
            <div class="headline">Minimal amount to deposit</div>
          </template>
          <template slot="right-top">
            <div class="flex md:flex-col whitespace-nowrap">
              <div class="value mr-2 md:mr-0">{{ needToDeposit | formatToken(token) }} {{ token }}</div>
              <div class="secondaryValue">{{ needToDeposit | formatUsdAmount(tokensPrices[token].price, token) }}</div>
            </div>
          </template>
        </values-block>
      </template>
    </modal>
    <modal :value="modal==='customError'" @close="modal=''">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"></i>
          <div>{{errorModal.headline}}</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm">{{errorModal.text}}</div>
      </template>
    </modal>


    <!-- Main -->
    <line-block>
      <template slot="first">
        <div class="tokenItem">
          <!-- <img src="/tokens/btc.svg" alt="BTC" class="tokenImg"> -->
          <div class="tokenName">{{token}}</div>
        </div>
      </template>
      <template slot="second">
        <div class="amount" :class="{'disabled': enoughZkBalance===false}">{{ zkBalance.rawBalance | formatTokenPretty(token) }} <span class="amountType md:hidden">L2</span></div>
      </template>
      <template slot="third">
        <div class="amount" @click="setDepositMaxAmount()" :class="[{'disabled': enoughZkBalance===true},{'error': enoughOnInitialToDeposit===false},{'cursor-pointer': (!enoughZkBalance && step==='default')}]">{{ initialBalance.rawBalance | formatTokenPretty(token) }} <span class="amountType md:hidden">L1</span></div>
      </template>
      <template v-if="step==='default'">
        <template slot="right" v-if="enoughZkBalance">
          <i class="text-base text-green fas fa-check-circle"></i>
        </template>
        <template slot="right" v-else>
          <amount-input ref="amountInput" v-model="depositAmount" :token="token" type="deposit" :class="{'error': !enoughDepositAmount}">
            <template slot="underInput">
              Required
            </template>
            <template slot="default">
              <defbtn @click="deposit()" v-if="initialBalance.unlocked===true">Deposit</defbtn>
              <defbtn @click="unlock()" v-else>Unlock <i class="fas fa-unlock-alt"></i></defbtn>
            </template>
          </amount-input>
        </template>
      </template>
      <template v-else-if="step==='depositing'">
        <template slot="right">
          <defbtn outline disabled v-if="substep==='waitingUserConfirmation'">
            <span>Confirm the deposit</span>
          </defbtn>
          <defbtn outline disabled loader v-else-if="substep==='depositing' || substep==='commiting'">
            <span>{{substep==='depositing'?'Depositing':'Commiting deposit'}}...</span>
          </defbtn>
        </template>
      </template>
      <template v-else-if="step==='unlocking'">
        <template slot="right">
          <defbtn outline disabled v-if="substep==='waitingUserConfirmation'">
            <span>Confirm the transaction</span>
          </defbtn>
          <defbtn outline disabled loader v-else-if="substep==='commiting'">
            <span>Commiting transaction...</span>
          </defbtn>
        </template>
      </template>
    </line-block>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { Balance, GweiBalance, Address, TokenPrices, ActiveDepositInterface } from "@/plugins/types";
import { deposit, unlockToken } from "@/plugins/walletActions/transaction";
import { BigNumber } from "ethers";
import utils from "@/plugins/utils";

export default Vue.extend({
  props: {
    token: {
      type: String,
      default: '',
      required: true
    },
    total: {
      type: String,
      default: '',
      required: true
    },
  },
  data() {
    return {
      modal: '',
      errorModal: {
        headline: '',
        text: ''
      },
      step: 'default',/* default, depositing, unlocking */
      substep: '',/* depositing: [waitingUserConfirmation,depositing,commiting], unlocking: [waitingUserConfirmation,commiting] */
      depositAmount: '',
    }
  },
  watch: {
    activeDeposits: {
      immediate: true,
      handler(val, oldVal) {
        if(!val){return}
        if(val.hasOwnProperty(this.token)) {
          this.step='depositing';
        }
        else if(this.step==='depositing' && oldVal.hasOwnProperty(this.token)) {
          this.step='default';
        }
      }
    }
  },
  computed: {
    tokensPrices: function(): TokenPrices {
      return this.$store.getters['tokens/getTokenPrices'];
    },
    zkBalance: function(): Balance {
      return this.$store.getters['wallet/getzkBalances'].find((e: Balance) => e.symbol === this.token );
    },
    initialBalance: function(): Balance {
      return this.$store.getters['wallet/getInitialBalances'].find((e: Balance) => e.symbol === this.token );
    },
    depositBigNumber: function(): GweiBalance {
      if(!this.depositAmount) {
        return "";
      }
      try {
        return utils.parseToken(this.token, this.depositAmount).toString();
      } catch (error) {
        return "";
      }
    },
    needToDeposit: function(): GweiBalance {
      try {
        return BigNumber.from(this.total).sub(this.zkBalance.rawBalance).toString();
      } catch (error) {
        return "";
      }
    },
    enoughZkBalance: function(): Boolean {
      return BigNumber.from(this.zkBalance.rawBalance).gte(this.total);
    },
    activeDeposits: function(): ActiveDepositInterface {
      return this.$store.getters['transaction/getActiveDeposits'] as ActiveDepositInterface
    },

    /**
     * Returns (L1+L2 balance >= Total to pay)
    */
    enoughWithInitialBalance: function(): Boolean {
      return BigNumber.from(this.zkBalance.rawBalance).add(BigNumber.from(this.initialBalance.rawBalance)).gte(this.total);
    },

    /**
     * Returns (Inputed deposit amount >= L1 Balance)
    */
    enoughOnInitialToDeposit: function(): Boolean {
      if(!this.depositAmount) {
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
     * Returns (Inputed deposit amount >= Total to pay - L2 balance)
    */
    enoughDepositAmount: function(): Boolean {
      if(!this.depositAmount) {
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
  methods: {
    setDepositMaxAmount: function() {
      if(!this.enoughZkBalance && this.step==='default') {
        this.depositAmount = utils.handleFormatTokenPretty(this.token, BigNumber.from(this.initialBalance.rawBalance).toString());
      }
    },
    setDepositMinAmount: function() {
      this.depositAmount = utils.handleFormatToken(this.token, this.needToDeposit);
    },
    deposit: async function() {
      if(!this.enoughWithInitialBalance) {
        this.modal = 'insufficientL1';
      }
      else if(!this.enoughOnInitialToDeposit) {
        this.modal = 'insufficientL1Deposit';
      }
      else if(!this.enoughDepositAmount) {
        this.modal = 'insufficientL1Min';
      }
      else if(this.$refs && this.$refs.amountInput && (this.$refs.amountInput as Vue).$data.error) {
        this.modal='customError';
        this.errorModal = {
          headline: `Inputed ${this.token} amount error`,
          text: (this.$refs.amountInput as Vue).$data.error
        }
      }
      else {
        try {
          this.substep = 'waitingUserConfirmation';
          this.step = 'depositing';
          const transferTransaction = await deposit(this.token, this.depositBigNumber, this.$store);
          this.substep = 'depositing';
          const receipt = await transferTransaction.awaitEthereumTxCommit();
          this.substep = 'commiting';
        } catch (error) {
          this.step = 'default';
          const createErrorModal = (text: string) => {
            this.errorModal = {
              headline: `Depositing ${this.token} error`,
              text: text
            }
          }
          if (error.message) {
            if (!error.message.includes("User denied")) {
              if (error.message.includes("Fee Amount is not packable")) {
                createErrorModal("Fee Amount is not packable");
              } else if (error.message.includes("Transaction Amount is not packable")) {
                createErrorModal("Transaction Amount is not packable");
              }
            }
          }
          else {
            createErrorModal("Unknow error. Try again later.");
          }
        }
      }
    },
    unlock: async function() {
      try {
        this.substep = 'waitingUserConfirmation';
        this.step = 'unlocking';
        const unlockTransaction = await unlockToken((this.initialBalance.address as Address), this.$store);
        this.substep = 'commiting';
        await unlockTransaction.wait();
        await this.$store.dispatch("wallet/getInitialBalances", true);
        this.step = 'default';
      } catch (error) {
        this.step = 'default';
        const createErrorModal = (text: string) => {
          this.errorModal = {
            headline: `Unlocking ${this.token} error`,
            text: text
          }
        }
        if (error.message) {
          if (!error.message.includes("User denied")) {
            createErrorModal(error.message);
          }
        }
        else {
          createErrorModal("Unknow error. Try again later.");
        }
      }
    }
  },
  mounted() {
    if(!this.enoughZkBalance) {
      this.setDepositMinAmount();
    }
  },
});
</script>
