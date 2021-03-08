<template>
  <div class="indexPage">
    <modal v-model="modal">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"></i>
          <div>Insufficient funds in the on-chain wallet to deposit</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm">On-chain wallet has insufficient funds to deposit minimal amount to zkSync L2 account. Top it up your on-chain wallet with minimal amount:</div>
        <values-block class="mt-3">
          <template slot="left-top">
            <div class="headline">Minimal amount to deposit</div>
          </template>
          <template slot="left-bottom">
            <div class="address hidden md:block">0xc0f97CC918C9d6fA4E9fc6be61a6a06589D199b2</div>
          </template>
          <template slot="right-top">
            <div class="flex md:flex-col whitespace-nowrap">
              <div class="value mr-2 md:mr-0">6.051 LINK</div>
              <div class="secondaryValue">23.45 $</div>
            </div>
          </template>
        </values-block>
      </template>
      <template slot="footer">
        <div class="flex items-center justify-center flex-wrap gap-2">
          <defbtn outline @click="modal=false">
            <i class="far fa-arrow-left"></i>
            <span>Cancel and return</span>
          </defbtn>
          <defbtn outline @click="modal=false">
            <span>Disconnect</span>
            <i class="far fa-power-off"></i>
          </defbtn>
          <defbtn @click="modal=false">
            <i class="far fa-sync-alt"></i>
            <span>All is done. Reload the checkout</span>
          </defbtn>
        </div>
      </template>
    </modal>

    <modal :value="errorModal!==false" @close="errorModal=false">
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

    <connected-wallet/>

    <note v-if="accountLocked">
      <template slot="icon">
        <i class="pl-1 text-base lg:text-lg text-gray far fa-unlock-alt"></i>
      </template>
      <template slot="default">
        <div class="text-gray text-xs lg:text-sm">
          To start using your account you need to register your public key once. This operation costs 15000 gas on-chain. In the future, we will eliminate this step by verifying ETH signatures with zero-knowledge proofs. Please bear with us!
        </div>
      </template>
    </note>

    <div v-if="step==='main'" class="w-full">
      <line-table-header class="mt-4 md:mt-7 mb-2">
        <template slot="first">To Pay</template>
        <template slot="second">L2 Balance</template>
        <template slot="first:md">To Pay / L2 Balance</template>
        <template slot="right">Deposit from mainnet</template>
      </line-table-header>
      <transaction-token v-model="tokenItemsValid[token]" v-for="(total, token) in totalByToken" :key="token" :token="token" :total="total.toString()" />
      <div class="mainBtnsContainer">
        <div class="mainBtns">
          <defbtn v-if="accountLocked" :loader="loading" :disabled="loading" @click="nextStep()">
            <i class="fas fa-unlock-alt"></i>
            <span>Activate the account</span>
          </defbtn>
          <defbtn v-else :disabled="!transferAllowed" :loading="loading" @click="nextStep()">
            <i class="fas fa-paper-plane"></i>
            <span>Complete payment</span>
          </defbtn>
        </div>
      </div>
    </div>
    <div v-else-if="step==='transfer'" class="w-full">
      <div class="font-firaCondensed font-medium text-3xl text-dark text-center pt-5 md:pt-10">Payment</div>
      <div class="text-lg text-center pt-2" v-if="substep==='waitingUserConfirmation'">Confirm the transaction to transfer</div>
      <div class="text-lg text-center pt-2" v-else-if="substep==='commiting'">Waiting for the transaction to be mined...</div>
      <loader class="mx-auto mt-6" size="md" color="violet" />
    </div>
    <div v-else-if="step==='success'" class="w-full">
      <div class="font-firaCondensed font-medium text-3xl text-green text-center pt-5 md:pt-10">Thank you!</div>
      <success-mark class="w-11/12 max-w-xxs mx-auto py-5" />
      <div class="text-xl text-center font-light pt-2">Wasn’t that easy? Learn more about <a class="text-lightviolet underline" href="https://zksync.io/" target="_blank">zkSync</a></div>
      <line-table-header class="mt-4 md:mt-7 mb-2">
        <template slot="first">Paid</template>
        <template slot="second">TX Hash</template>
        <template slot="first:md">Paid / TX Hash</template>
      </line-table-header>
      <template v-for="(item,index) in finalTransactions">
        <line-block :key="index">
          <template slot="first">
            <div class="tokenItem">
              <div class="tokenName">{{getTokenByID(item.txData.tx.token)}}</div>
            </div>
          </template>
          <template slot="second">
            <div class="amount">{{ item.txData.tx.fee==='0'?item.txData.tx.amount:item.txData.tx.fee | formatToken(getTokenByID(item.txData.tx.token)) }}</div>
          </template>
          <template slot="third">
            <a class="transactionLink" :href="getTxLink(item.txHash)" target="_blank">
              <span class="text-gray text-xs col-span-2" v-if="item.txData.tx.fee!=='0'">Fee transaction</span>
              <span class="text-xxs text-dark2">{{item.txHash}}</span>
              <i class="text-xs text-violet pl-1 fas fa-external-link"></i>
            </a>
          </template>
        </line-block>
      </template>
    </div>


  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { TransactionData, TotalByToken, Balance, TransactionFee, Transaction } from "@/plugins/types";
import { APP_ZKSYNC_BLOCK_EXPLORER } from "@/plugins/build";
import { changePubKey } from "@/plugins/walletActions/transaction";
import { transactionBatch } from "@/plugins/walletActions/transaction";

import connectedWallet from "@/blocks/connectedWallet.vue";
import lineTableHeader from "@/blocks/lineTableHeader.vue";

export default Vue.extend({
  components: {
    connectedWallet,
    lineTableHeader,
  },
  data() {
    return {
      modal: false,
      step: "main",/* main, transfer, success */
      substep: "",/* waitingUserConfirmation, commiting */
      loading: false,
      tokenItemsValid: {} as {
        [token: string]: Boolean
      },
      finalTransactions: [] as Array<Transaction>,
      errorModal: false as
        | false
        | {
            headline: string;
            text: string;
          },
    };
  },
  computed: {
    zkBalances(): Array<Balance> {
      return this.$store.getters["wallet/getzkBalances"];
    },
    transactionData(): TransactionData {
      return this.$store.getters["checkout/getTransactionData"];
    },
    totalByToken(): TotalByToken {
      return this.$store.getters["checkout/getTotalByToken"];
    },
    accountLocked(): Boolean {
      return this.$store.getters["wallet/isAccountLocked"];
    },
    transferAllowed(): Boolean {
      for(const [token, state] of Object.entries(this.tokenItemsValid)) {
        if(!state) {
          return false;
        }
      }
      return true;
    },
  },
  methods: {
    nextStep() {
      if (this.step === "main") {
        if (this.accountLocked) {
          this.changePubKey();
        } else {
          this.transfer();
        }
      }
    },
    getTokenByID(id: number) {
      return this.$store.getters['tokens/getTokenByID'](id).symbol;
    },
    getTxLink(hash: string) {
      return `${APP_ZKSYNC_BLOCK_EXPLORER}/transactions/${hash}`;
    },
    async changePubKey() {
      this.loading = true;
      try {
        await changePubKey(this.transactionData.feeToken, this.$store.getters['checkout/getAccountUnlockFee'], this.$store);
        await this.$store.dispatch("wallet/getzkBalances", { accountState: undefined, force: true });
      } catch (error) {
        const createErrorModal = (text: string) => {
          this.errorModal = {
            headline: `Activating account error`,
            text,
          };
        };
        if (error.message) {
          if (!error.message.includes("User denied")) {
            if(error.message.includes("Account does not exist in the zkSync network")) {
              createErrorModal("Please, make deposit or request tokens in order to activate the account.");
            }
            else {
              createErrorModal(error.message);
            }
          }
        } else {
          createErrorModal("Unknow error. Try again later.");
        }
      }
      this.loading = false;
    },
    async transfer() {
      if(this.transferAllowed) {
        const transactionData = this.transactionData;
        const getTransactionFee = this.$store.getters["checkout/getTransactionBatchFee"] as TransactionFee;
        this.step = "transfer";
        this.substep = "waitingUserConfirmation";
        try {
          const transactions = await transactionBatch(transactionData.transactions, transactionData.feeToken, getTransactionFee.amount, this.$store);
          console.log('transaction', transactions);
          this.finalTransactions.push(...transactions);
          this.substep = "commiting";
          await transactions[0].awaitReceipt();/* Not sure if required. Wait for the first transaction (at least) to be confirmed */
          this.step = "success";
        } catch (error) {
          this.step = "main";
          if (error.message) {
            if (!error.message.includes("User denied")) {
              this.errorModal = {
                headline: "Transfer error",
                text: error.message
              };
            }
          } else {
            this.errorModal = {
              headline: "Transfer error",
              text: "Unknow error. Try again later."
            };
          }
        }
      }
    },
  },
});
</script>
