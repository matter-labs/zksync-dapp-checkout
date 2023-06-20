<template>
  <div class="w-full transactionTokenContainer" :class="{ rowLayout: isInProgress || enoughZkBalance || !enoughWithInitialBalance }">
    <!-- Modals -->
    <zk-modal :value="modal === 'insufficientL1Deposit' || modal === 'insufficientL1Min'" @close="modal = ''">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"></i>
          <div>Insufficient funds in the on-chain wallet to deposit</div>
        </div>
      </template>
      <template slot="default">
        <div v-if="modal === 'insufficientL1Deposit'" class="text-sm">
          On-chain wallet has insufficient funds to deposit
          <strong>{{ depositBigNumber | parseBigNumberish(token) }} {{ token }}</strong>
          to RIF Rollup L2 account. Your on-chain balance is
          <strong
            class="cursor-pointer"
            @click="
              setDepositMaxAmount();
              modal = '';
            "
          >{{ initialBalance | parseBigNumberish(token) }} {{ token }}</strong
          >.
        </div>
        <div v-else-if="modal === 'insufficientL1Min'" class="text-sm">
          <b>{{ depositBigNumber | parseBigNumberish(token) }} {{ token }}</b> will not be enough to commit the transaction. The minimal amount is:
        </div>
        <zk-values-block
          class="mt-3 cursor-pointer"
          @click="
            setDepositMinAmount();
            modal = '';
          ">
          <template slot="left-top">
            <div class="headline">Minimal amount to deposit</div>
          </template>
          <template slot="right-top">
            <div class="flex flex-col items-end whitespace-nowrap">
              <div class="value">{{ needToDeposit | parseBigNumberish(token) }} {{ token }}</div>
              <div class="secondaryValue">{{ needToDeposit | formattedPrice(token) }}</div>
            </div>
          </template>
        </zk-values-block>
        <zk-values-block
          class="mt-3 cursor-pointer"
          @click="
            setDepositRecommendedAmount();
            modal = '';
          ">
          <template slot="left-top">
            <div class="headline">Recommended deposit amount</div>
          </template>
          <template slot="right-top">
            <div class="flex flex-col items-end whitespace-nowrap">
              <div class="value">{{ recommendedDeposit | parseBigNumberish(token) }} {{ token }}</div>
              <div class="secondaryValue">{{ recommendedDeposit | formattedPrice(token) }}</div>
            </div>
          </template>
        </zk-values-block>
      </template>
    </zk-modal>

    <zk-modal :value="modal === 'customError'" @close="modal = ''">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
          <div>{{ errorModal.headline }}</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm">{{ errorModal.text }}</div>
      </template>
    </zk-modal>

    <!-- Main -->
    <zk-line-block>
      <template slot="first">
        <div class="tokenItem">
          <div class="tokenName">{{ token }}</div>
        </div>
      </template>
      <template slot="second">
        <div class="amount">
          <span v-if="!isFeeTokenLoading">{{ total | parseBigNumberish(token) }}</span>
          <span v-else class="text-gray text-sm">Loading...</span>
        </div>
      </template>
      <template slot="third">
        <div class="amount">
          <span :class="amountClass">{{ ((zkBalance && zkBalance.balance) || "0") | parseBigNumberish(token) }}</span>
        </div>
      </template>
      <template v-if="isInProgress" slot="right">
        <div class="flex items-center">
          <div class="text-gray text-xs font-medium" :class="{ 'mr-2': isLoading }">{{ lineStateText }}</div>
          <zk-loader v-if="isLoading" color="gray" size="sm" />
        </div>
      </template>
      <template v-else>
        <template v-if="enoughZkBalance" slot="right">
          <div class="flex justify-between items-center text-xs font-medium mr-2 text-green">Ready <zk-success-check-mark class="w-8 h-8" /></div>
        </template>
        <template v-else slot="right">
          <div v-if="isFeeTokenLoading" class="text-red text-xs">
            <span class="text-gray text-sm">Loading...</span>
          </div>
          <div v-else-if="!enoughWithInitialBalance" class="flex items-center">
            <i v-tooltip.bottom="`Update ${token} balance`" :disabled="ethereumBalanceLoading" class="far fa-sync-alt iconBtn text-md mr-3" @click="refreshBalance()"></i>
            <buy-with-ramp-btn v-if="allowedRampZkTokens.includes(token)" :token="token" :disabled="ethereumBalanceLoading" />
            <span v-else class="text-red text-xs"
            >Insufficient <strong>{{ token }} {{ currentNetworkName }}</strong> balance</span
            >
          </div>
          <zk-defbtn v-else-if="!unlocked" @click="unlock()"> <i class="fas fa-unlock-alt" /><span>Unlock</span> </zk-defbtn>
          <amount-input v-else ref="amountInput" v-model="depositAmount" :token="token" type="deposit" :class="{ error: !enoughDepositAmount }">
            <template slot="underInput">
              <div class="minAmount text-xxs" @click="setDepositMinAmount()">Min: {{ needToDeposit | parseBigNumberish(token) }}</div>
            </template>
            <template slot="default">
              <zk-defbtn v-if="unlocked" :disabled="!depositBigNumber || !enoughDepositAmount" @click="deposit()">
                <i class="fal fa-arrow-to-right" />
                <span>Deposit</span>
              </zk-defbtn>
              <zk-defbtn v-else @click="unlock()">
                <i class="fas fa-unlock-alt" />
                <span>Unlock</span>
              </zk-defbtn>
            </template>
          </amount-input>
        </template>
      </template>
    </zk-line-block>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BigNumber, BigNumberish } from "ethers";
import { Wallet } from "@rsksmart/rif-rollup-js-sdk";
import { Network, TokenSymbol } from "@rsksmart/rif-rollup-js-sdk/build/types";
import { ZkTokenBalance } from "@rsksmart/rif-rollup-nuxt-core/types";
import { filterError } from "@rsksmart/rif-rollup-nuxt-core/utils";

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
      step: "default" as "default" | "depositing" | "unlocking",
      subStep: "" as "waitingUserConfirmation" | "depositing" | "committing" | "confirming",
      depositAmount: "",
    };
  },
  computed: {
    accountStateLoaded(): boolean {
      return this.$store.getters["zk-account/accountStateRequested"];
    },
    ethereumBalanceLoading(): boolean {
      return this.$store.getters["zk-balances/ethereumBalanceLoading"][this.token];
    },
    unlocked(): boolean {
      // eslint-disable-next-line no-unused-expressions
      this.$store.getters["zk-balances/tokensAllowanceForceUpdate"];
      return this.enoughZkBalance || BigNumber.from(this.$store.getters["zk-balances/tokenAllowance"](this.token) || "0").gte(this.needToDeposit);
    },
    currentNetworkName(): Network {
      return this.$store.getters["zk-provider/network"];
    },
    isFeeTokenLoading(): boolean {
      return (
        this.token === this.$store.getters["zk-transaction/feeSymbol"] &&
        (this.$store.getters["zk-transaction/feeLoading"] || this.$store.getters["zk-transaction/activationFeeLoading"])
      );
    },
    isAllowanceLoading(): boolean {
      // eslint-disable-next-line no-unused-expressions
      this.$store.getters["zk-balances/tokensAllowanceForceUpdate"];
      return !!this.$store.getters["zk-balances/tokensAllowanceLoading"][this.token];
    },
    isInProgress(): boolean {
      return this.step !== "default" || !this.accountStateLoaded || this.ethereumBalanceLoading || this.isFeeTokenLoading || this.isAllowanceLoading || this.isZkBalanceDepositing;
    },
    isLoading(): boolean {
      return (
        (this.isInProgress && this.subStep === "committing") ||
        this.subStep === "confirming" ||
        !this.accountStateLoaded ||
        this.ethereumBalanceLoading ||
        this.isFeeTokenLoading ||
        this.isAllowanceLoading ||
        this.isZkBalanceDepositing
      );
    },
    amountClass(): string {
      return this.enoughZkBalance ? "text-green" : "text-red";
    },
    zkBalance(): ZkTokenBalance | undefined {
      return this.$store.getters["zk-balances/balances"][this.token];
    },
    isZkBalanceDepositing(): boolean {
      return BigNumber.from(this.$store.getters["zk-balances/depositingBalances"][this.token]?.amount || "0").gt("0");
    },
    confirmationsAmount(): number {
      return this.$store.getters["checkout/getConfirmationsAmount"];
    },
    initialBalance(): BigNumber {
      return BigNumber.from(this.$store.getters["zk-balances/ethereumBalances"][this.token] || "0");
    },
    depositBigNumber(): BigNumberish {
      if (!this.depositAmount) {
        return "";
      }
      try {
        return this.$options.filters!.parseDecimal(this.depositAmount, this.token).toString();
      } catch (error) {
        return "";
      }
    },
    needToDeposit(): BigNumberish {
      try {
        const txBatchFee = this.$store.getters["checkout/getTransactionBatchFee"];
        const recommendedAmount = BigNumber.from(this.total).sub(this.zkBalance?.balance.toString() || "0");
        if (txBatchFee.token === this.token) {
          const amount = BigNumber.from(this.total)
            .sub(txBatchFee.amount)
            .add(txBatchFee.realAmount)
            .sub(this.zkBalance?.balance.toString() || "0");
          if (amount.lte("0") && recommendedAmount.gt("0")) {
            return amount.toString();
          }
        }
        return recommendedAmount.toString();
      } catch (error) {
        return "";
      }
    },
    recommendedDeposit(): BigNumberish {
      try {
        if (this.token === this.$store.getters["checkout/getTransactionData"].feeToken) {
          const batchFee = this.$store.getters["checkout/getTransactionBatchFee"].realAmount.div(100).mul(30);
          return BigNumber.from(this.needToDeposit).add(batchFee).toString();
        }
        return this.needToDeposit;
      } catch (error) {
        return "0";
      }
    },
    enoughZkBalance(): boolean {
      return BigNumber.from(this.zkBalance?.balance || "0").gte(this.total) || BigNumber.from(this.needToDeposit).lte("0");
    },
    allowedRampZkTokens(): TokenSymbol[] {
      return this.$store.getters["checkout/getAllowedRampZkTokens"];
    },
    lineStateText(): string {
      if (this.subStep === "confirming" || this.isZkBalanceDepositing) {
        return `Waiting for ${this.confirmationsAmount} confirmations.`;
      }
      switch (this.subStep) {
        case "waitingUserConfirmation":
          return "Confirm operation";
        case "committing":
          return "Committing transaction...";

        default:
          return "";
      }
    },

    /**
     * Returns (L1+L2 balance >= Total to pay)
     */
    enoughWithInitialBalance(): boolean {
      return BigNumber.from(this.zkBalance?.balance || "0")
        .add(this.initialBalance)
        .gte(this.total);
    },

    /**
     * Returns (Inputted deposit amount >= L1 Balance)
     */
    enoughOnInitialToDeposit(): boolean {
      if (!this.depositAmount) {
        return true;
      }
      try {
        return !BigNumber.from(this.depositBigNumber).gt(this.initialBalance);
      } catch (error) {
        return false;
      }
    },

    /**
     * Returns (Inputted deposit amount >= Total to pay - L2 balance)
     */
    enoughDepositAmount(): boolean {
      if (!this.depositAmount) {
        return true;
      }
      try {
        return BigNumber.from(this.depositBigNumber).gte(this.needToDeposit);
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
    needToDeposit(val) {
      if (val > 0) {
        this.depositAmount = this.$options.filters!.parseBigNumberish(this.needToDeposit, this.token);
      }
    },
    step(val) {
      this.$emit("input", this.enoughZkBalance && val === "default");
    },
    isInProgress(val, oldVal) {
      if (!val && oldVal && (!this.depositAmount || this.depositAmount === "0") && !this.enoughZkBalance) {
        this.setDepositRecommendedAmount();
      }
    },
  },
  created() {
    if (!this.enoughZkBalance) {
      this.setDepositRecommendedAmount();
    }
  },
  methods: {
    refreshBalance() {
      this.$store.dispatch("zk-balances/requestEthereumBalance", { symbol: this.token, force: true });
      this.$store.dispatch("zk-account/updateAccountState");
    },
    setDepositMaxAmount() {
      this.depositAmount = this.$options.filters!.parseBigNumberish(this.initialBalance.toString(), this.token);
    },
    setDepositMinAmount() {
      this.depositAmount = this.$options.filters!.parseBigNumberish(this.needToDeposit, this.token);
    },
    setDepositRecommendedAmount() {
      this.$set(this, "depositAmount", this.$options.filters!.parseBigNumberish(this.recommendedDeposit, this.token));
    },
    async deposit() {
      if (!this.enoughOnInitialToDeposit) {
        this.modal = "insufficientL1Deposit";
      } else if (!this.enoughDepositAmount) {
        this.modal = "insufficientL1Min";
      } else if (this.$refs && this.$refs.amountInput && (this.$refs.amountInput as Vue).$data.error) {
        this.modal = "customError";
        this.errorModal = {
          headline: `Inputted ${this.token} amount error`,
          text: (this.$refs.amountInput as Vue).$data.error,
        };
      } else {
        try {
          this.subStep = "waitingUserConfirmation";
          this.step = "depositing";
          const syncWallet: Wallet = this.$store.getters["zk-wallet/syncWallet"];
          const depositResponse = await syncWallet.depositToSyncFromRootstock({
            depositTo: syncWallet.address(),
            token: this.token,
            amount: this.depositBigNumber,
          });
          if (!depositResponse) {
            throw new Error("Unexpected payment error!");
          }
          this.subStep = "committing";
          await depositResponse.awaitRootstockTxCommit();
          this.subStep = "confirming";
          await depositResponse.awaitReceipt();
          console.log("depositResponse", depositResponse);
          const dataPromises = [
            this.$store.dispatch("zk-balances/requestEthereumBalance", { force: true, symbol: "ETH" }),
            this.$store.dispatch("zk-account/updateAccountState", true),
          ];
          if (this.token !== "ETH") {
            dataPromises.push(this.$store.dispatch("zk-balances/requestAllowance", { force: true, symbol: this.token }));
            dataPromises.push(this.$store.dispatch("zk-balances/requestEthereumBalance", { force: true, symbol: this.token }));
          }
          await Promise.all(dataPromises);
          this.step = "default";
        } catch (error) {
          console.log("Deposit error", error);
          this.step = "default";
          const realError = filterError(error as Error);
          if (realError) {
            this.errorModal = {
              headline: "Depositing token error",
              text: realError,
            };
          }
        }
      }
    },
    async unlock() {
      try {
        this.subStep = "waitingUserConfirmation";
        this.step = "unlocking";
        const syncWallet: Wallet = this.$store.getters["zk-wallet/syncWallet"];
        const tokenAddress = syncWallet.provider.tokenSet.resolveTokenAddress(this.token);
        const unlockTransaction = await syncWallet.approveERC20TokenDeposits(tokenAddress);
        this.subStep = "committing";
        await unlockTransaction.wait();
        await Promise.all([
          this.$store.dispatch("zk-balances/requestAllowance", { force: true, symbol: this.token }),
          this.$store.dispatch("zk-balances/requestEthereumBalance", { force: true, symbol: "ETH" }),
        ]);
        this.step = "default";
      } catch (error) {
        this.step = "default";
        const realError = filterError(error as Error);
        if (realError) {
          this.errorModal = {
            headline: "Unlocking token error",
            text: realError,
          };
        }
      }
    },
  },
});
</script>
