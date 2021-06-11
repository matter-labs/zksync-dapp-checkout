<template>
  <div class="indexPage">
    <zk-modal
      :value="modal === 'feeChanged'"
      @close="
        modal = false;
        cancelTransfer();
      "
    >
      <template slot="header">
        <div class="withIcon text-warning text-yellow">
          <i class="fad fa-info-square" />
          <div>Fee changed</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm">The price for zkSync transactions fluctuates a little bit to make sure that zkSync runs as close as possible to break-even costs.</div>
        <zk-values-block class="mt-3">
          <template slot="left-top">
            <div class="headline">Previous fee</div>
          </template>
          <template slot="right-top">
            <div class="flex flex-col items-end whitespace-nowrap">
              <div class="value">
                {{ transactionFees.previous | formatUsdAmount(tokensPrices[transactionData.feeToken] && tokensPrices[transactionData.feeToken].price, transactionData.feeToken) }}
              </div>
              <div class="secondaryValue">{{ transactionFees.previous | formatToken(transactionData.feeToken) }} {{ transactionData.feeToken }}</div>
            </div>
          </template>
        </zk-values-block>
        <zk-values-block class="mt-3">
          <template slot="left-top">
            <div class="headline">New fee</div>
          </template>
          <template slot="right-top">
            <div class="flex flex-col items-end whitespace-nowrap">
              <div class="value">
                {{ transactionFees.new | formatUsdAmount(tokensPrices[transactionData.feeToken] && tokensPrices[transactionData.feeToken].price, transactionData.feeToken) }}
              </div>
              <div class="secondaryValue">{{ transactionFees.new | formatToken(transactionData.feeToken) }} {{ transactionData.feeToken }}</div>
            </div>
          </template>
        </zk-values-block>
      </template>
      <template slot="footer">
        <div class="flex items-center justify-center flex-wrap gap-2">
          <zk-defbtn
            outline
            @click="
              modal = false;
              cancelTransfer();
            "
          >
            <i class="far fa-arrow-left" />
            <span>Cancel payment</span>
          </zk-defbtn>
          <zk-defbtn
            @click="
              modal = false;
              transfer();
            "
          >
            <i class="fas fa-paper-plane" />
            <span>Complete payment</span>
          </zk-defbtn>
        </div>
      </template>
    </zk-modal>

    <zk-modal :value="errorModal !== false" @close="errorModal = false">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square" />
          <div>{{ errorModal.headline }}</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm">
          {{ errorModal.text }}
        </div>
      </template>
    </zk-modal>

    <connected-wallet />

    <div v-if="step === 'main'" class="w-full">
      <zk-max-height class="mt-5 md:mt-7" :value="!transferAllowed">
        <zk-note>
          <template slot="icon">
            <i class="text-gray text-xl fal fa-info-square" />
          </template>
          <template slot="default">
            <div class="text-sm text-gray font-light">
              The default amount to deposit is 5% higher than the minimal required one to take into account the risk of fluctuating transaction fees.<br />
            </div>
          </template>
        </zk-note>
      </zk-max-height>

      <line-table-header class="mt-5 mb-2">
        <template slot="first"> To pay </template>
        <template slot="second"> L2 balance </template>
        <template slot="first:md"> To pay / L2 balance </template>
        <template slot="right" />
      </line-table-header>
      <transaction-token v-for="(total, token) in totalByToken" :key="token" v-model="tokenItemsValid[token]" :token="token" :total="total.toString()" />
      <div class="mainBtnsContainer">
        <div class="mainBtns">
          <zk-defbtn v-if="displayActivateAccountBtn" :disabled="!canCPK || cpkLoading" :loader="cpkLoading" @click="signActivation()">
            <i class="fas fa-unlock"></i>
            <span>{{ cpkBtnText }}</span>
          </zk-defbtn>
          <zk-defbtn v-else :disabled="!transferAllowed" @click="preTransfer()">
            <i class="fas fa-paper-plane" />
            <span>Complete payment</span>
          </zk-defbtn>
        </div>
      </div>
    </div>
    <div v-else-if="step === 'transfer'" class="w-full">
      <div class="font-firaCondensed font-medium text-3xl text-dark -dark text-center pt-5 md:pt-10">Payment</div>
      <div v-if="subStep === 'processing'" class="text-lg text-center pt-2">Processing...</div>
      <div v-else-if="subStep === 'waitingUserConfirmation'" class="text-lg text-center pt-2">Follow the instructions in your wallet</div>
      <div v-else-if="subStep === 'committing'" class="text-lg text-center pt-2">Waiting for the transaction to be mined...</div>
      <zk-loader class="mx-auto mt-6" size="md" color="violet" />
    </div>
    <div v-else-if="step === 'success'" class="w-full">
      <div class="font-firaCondensed font-medium text-3xl text-green text-center pt-5 md:pt-10">Done. Thank you!</div>
      <zk-success-check-mark big class="w-11/12 max-w-xxs mx-auto py-5" />
      <div class="text-md text-center font-light pt-2">Wasn't that easy? Learn more about <a class="linkDefault" href="https://zksync.io/" target="_blank">zkSync</a></div>
      <div class="mainBtnsContainer">
        <div class="mainBtns">
          <zk-defbtn :disabled="!transferAllowed" @click="close()">
            <i class="far fa-times" />
            <span>Close</span>
          </zk-defbtn>
        </div>
      </div>
      <line-table-header class="mt-10 md:mt-7 mb-2">
        <template slot="first"> Paid </template>
        <template slot="second" />
        <template slot="first:md"> &nbsp; </template>
        <template slot="right"> Paid / TX Hash </template>
      </line-table-header>

      <template v-for="(item, index) in finalTransactions">
        <zk-line-block :key="index">
          <template slot="first">
            <div class="tokenItem">
              <div class="tokenName">
                {{ getTokenByID(typeof item.txData.tx.token === "number" ? item.txData.tx.token : item.txData.tx.feeToken) }}
              </div>
            </div>
          </template>
          <template slot="second">
            <div class="amount">
              {{
                item.txData.tx.fee === "0"
                  ? item.txData.tx.amount
                  : item.txData.tx.fee | formatToken(getTokenByID(typeof item.txData.tx.token === "number" ? item.txData.tx.token : item.txData.tx.feeToken))
              }}
            </div>
          </template>
          <template slot="third">
            <a class="transactionLink linkDefault" :href="getTxLink(item.txHash)" target="_blank">
              <!--<span v-if="item.txData.tx.fee!=='0'" class="text-gray text-xs col-span-2">Fee transaction</span>-->
              <div class="font-light txHash text-xxs md:text-right">
                {{ item.txHash | formatTransaction }}
              </div>
              <i class="text-xs text-violet -dark pl-1 fal fa-external-link" />
            </a>
          </template>
        </zk-line-block>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { TransactionData, TotalByToken, TransactionFee, Transaction, TokenPrices, CPKLocal } from "@/types/index";
import { ZkSyncTransaction } from "zksync-checkout/src/types";
import { APP_ZKSYNC_BLOCK_EXPLORER, ETHER_NETWORK_NAME } from "@/plugins/build";
import { walletData } from "@/plugins/walletData";
import zkUtils from "@/plugins/utils";
import { utils } from "zksync";
import { getCPKTx, saveCPKTx } from "@/plugins/walletActions/cpk";
import { transactionBatch } from "@/plugins/walletActions/transaction";

import connectedWallet from "@/blocks/connectedWallet.vue";
import lineTableHeader from "@/blocks/lineTableHeader.vue";
import { ZkSyncCheckoutManager } from "zksync-checkout-internal";

export default Vue.extend({
  components: {
    connectedWallet,
    lineTableHeader,
  },
  filters: {
    formatTransaction(value: string) {
      return value.replace("sync-tx:", "");
    },
  },
  data() {
    return {
      modal: false as false | "feeChanged",
      step: "main" as "main" | "transfer" | "success",
      subStep: "" as "processing" | "waitingUserConfirmation" | "committing",
      cpkMessageSigned: false,
      cpkState: "main" as "main" | "processing" | "waitingUserConfirmation",
      tokenItemsValid: {} as {
        [token: string]: boolean;
      },
      finalTransactions: [] as Array<Transaction>,
      errorModal: false as
        | false
        | {
            headline: string;
            text: string;
          },
      transactionFees: {
        previous: "0",
        new: "0",
      },
    };
  },
  computed: {
    currentNetworkName(): string {
      return ETHER_NETWORK_NAME;
    },
    isAccountLocked(): TransactionData {
      return this.$store.getters["wallet/isAccountLocked"];
    },
    transactionData(): TransactionData {
      return this.$store.getters["checkout/getTransactionData"];
    },
    totalByToken(): TotalByToken {
      return this.$store.getters["checkout/getTotalByToken"];
    },
    transferAllowed(): boolean {
      for (const [, state] of Object.entries(this.tokenItemsValid)) {
        if (!state) {
          return false;
        }
      }
      return true;
    },
    tokensPrices(): TokenPrices {
      return this.$store.getters["tokens/getTokenPrices"];
    },
    displayActivateAccountBtn(): boolean {
      if (this.isAccountLocked) {
        this.checkCPKMessageSigned();
        return !this.cpkMessageSigned;
      }
      return false;
    },
    canCPK(): boolean {
      return typeof this.$store.getters["account/accountID"] === "number";
    },
    cpkLoading(): boolean {
      return this.cpkState === "processing" || this.cpkState === "waitingUserConfirmation";
    },
    cpkBtnText(): string {
      switch (this.cpkState) {
        case "processing":
          return "Processing...";
        case "waitingUserConfirmation":
          return "Follow the instructions in your wallet";

        default:
          return "Activate account";
      }
    },
  },
  methods: {
    getTokenByID(id: number) {
      return this.$store.getters["tokens/getTokenByID"](id)?.symbol;
    },
    getTxLink(hash: string) {
      return `${APP_ZKSYNC_BLOCK_EXPLORER}/transactions/${hash}`;
    },
    async preTransfer() {
      this.step = "transfer";
      this.subStep = "processing";
      try {
        const transactionFeesPrevious = this.$store.getters["checkout/getTransactionBatchFee"].amount.toString();
        await this.$store.dispatch("checkout/getTransactionBatchFee");
        const transactionFeesNew = this.$store.getters["checkout/getTransactionBatchFee"].amount.toString();
        if (transactionFeesPrevious !== transactionFeesNew) {
          this.transactionFees = {
            previous: transactionFeesPrevious,
            new: transactionFeesNew,
          };
          this.modal = "feeChanged";
        } else {
          this.transfer();
        }
      } catch (error) {
        this.step = "main";
        this.modal = false;
        if (error.message) {
          this.errorModal = {
            headline: "Payment error",
            text: error.message,
          };
        } else {
          this.errorModal = {
            headline: "Payment error",
            text: "Unknown error. Try again later.",
          };
        }
      }
    },
    cancelTransfer() {
      this.step = "main";
    },
    async transfer() {
      if (!this.transferAllowed) {
        return;
      }
      const transactionData = this.transactionData;
      this.step = "transfer";
      this.subStep = "waitingUserConfirmation";
      try {
        const transactionsList = [] as Array<ZkSyncTransaction>;
        transactionsList.push(...transactionData.transactions);
        const transactionFees = this.$store.getters["checkout/getTransactionBatchFee"] as TransactionFee;
        const transactions = await transactionBatch(
          transactionsList,
          transactionData.feeToken,
          transactionFees.amount, this.$stor.getters["wallet/isAccountLocked"], this.$store);
        console.log("Batch transaction", transactionsList);

        const manager = ZkSyncCheckoutManager.getManager();

        let endHashes = [];
        const validHashes = transactions.filter((tx: any) => {
          if (tx.txData.tx.type !== "Transfer") {
            return false;
          }
          for (const singleTx of transactionsList) {
            if (
              typeof tx.txData.tx.to === "string" &&
              typeof singleTx.to === "string" &&
              tx.txData.tx.to.toLowerCase() === singleTx.to.toLowerCase() &&
              tx.txData.tx.amount === singleTx.amount
            ) {
              return true;
            }
          }
          return false;
        });
        endHashes = validHashes.map((tx: any) => tx.txHash);
        console.log("Sent hashes", endHashes);
        manager.notifyHashes(endHashes);

        // @ts-ignore
        this.finalTransactions.push(...transactions);
        this.subStep = "committing";

        await transactions[0].awaitReceipt();
        this.step = "success";
      } catch (error) {
        this.checkCPKMessageSigned();
        this.step = "main";
        if (error.message) {
          if (!error.message.includes("User denied")) {
            if (error.message.includes("Account does not exist in the zkSync network")) {
              this.errorModal = {
                headline: "Payment error",
                text: "Please, make deposit or request tokens in order to activate the account.",
              };
            } else {
              this.errorModal = {
                headline: "Payment error",
                text: error.message,
              };
            }
          }
        } else {
          this.errorModal = {
            headline: "Payment error",
            text: "Unknown error. Try again later.",
          };
        }
      }
    },
    async signActivation() {
      this.cpkState = "processing";
      try {
        const syncWallet = walletData.get().syncWallet!;
        const nonce = await syncWallet.getNonce("committed");
        if (syncWallet.ethSignerType?.verificationMethod === "ERC-1271") {
          const isOnchainAuthSigningKeySet = await syncWallet.isOnchainAuthSigningKeySet();
          if (!isOnchainAuthSigningKeySet) {
            const onchainAuthTransaction = await syncWallet.onchainAuthSigningKey();
            await onchainAuthTransaction?.wait();
          }
        }

        const newPubKeyHash = await syncWallet.signer!.pubKeyHash();
        const accountID = await syncWallet.getAccountId();
        if (typeof accountID !== "number") {
          throw new TypeError("It is required to have a history of balances on the account to activate it.");
        }
        const changePubKeyMessage = utils.getChangePubkeyLegacyMessage(newPubKeyHash, nonce, accountID!);
        this.cpkState = "waitingUserConfirmation";
        const ethSignature = (await syncWallet.getEthMessageSignature(changePubKeyMessage)).signature;
        const changePubkeyTx: CPKLocal = {
          accountId: accountID!,
          account: syncWallet.address(),
          newPkHash: newPubKeyHash,
          nonce,
          ethSignature,
          validFrom: 0,
          validUntil: utils.MAX_TIMESTAMP,
        };
        saveCPKTx(this.$store.getters["account/address"], changePubkeyTx);
        this.cpkState = "processing";
        await new Promise((resolve) => {
          // Just for the UX reasons
          setTimeout(() => {
            resolve(undefined);
          }, 500);
        });
        this.cpkState = "main";
      } catch (error) {
        this.cpkState = "main";
        const errorMsg = zkUtils.filterError(error);
        if (typeof errorMsg === "string") {
          this.errorModal = {
            headline: "Activation error",
            text: errorMsg,
          };
        }
      }
      this.checkCPKMessageSigned();
    },
    checkCPKMessageSigned(): boolean {
      try {
        getCPKTx(this.$store.getters["account/address"]);
        this.cpkMessageSigned = true;
      } catch (error) {
        this.cpkMessageSigned = false;
      }
      return this.cpkMessageSigned;
    },
    close() {
      window.close();
    },
  },
});
</script>
