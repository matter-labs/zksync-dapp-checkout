<template>
  <div class="indexPage">
    <modal v-model="modal">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"/>
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
            <i class="far fa-arrow-left"/>
            <span>Cancel and return</span>
          </defbtn>
          <defbtn outline @click="modal=false">
            <span>Disconnect</span>
            <i class="far fa-power-off"/>
          </defbtn>
          <defbtn @click="modal=false">
            <i class="far fa-sync-alt"/>
            <span>All is done. Reload the checkout</span>
          </defbtn>
        </div>
      </template>
    </modal>

    <modal :value="errorModal!==false" @close="errorModal=false">
      <template slot="header">
        <div class="withIcon text-red">
          <i class="fad fa-info-square"/>
          <div>{{errorModal.headline}}</div>
        </div>
      </template>
      <template slot="default">
        <div class="text-sm">{{errorModal.text}}</div>
      </template>
    </modal>

    <connected-wallet/>

    <note v-if="isAccountLocked">
      <template slot="icon">
        <i class="pl-1 text-base lg:text-lg text-gray far fa-unlock-alt"></i>
      </template>
      <template slot="default">
        <div class="text-gray text-xs lg:text-sm">
          To start using your account you need to sign a new zkSync public key with your Ethereum wallet.
        </div>
      </template>
    </note>

    <div v-if="step==='main'" class="w-full">
      <line-table-header class="mt-5 md:mt-7 mb-2" v-if="!isAccountLocked">
        <template slot="first">To pay</template>
        <template slot="second">L2 balance</template>
        <template slot="first:md">To pay / L2 balance</template>
        <template slot="right">Deposit from <strong>{{currentNetworkName}}</strong></template>
      </line-table-header>
      <transaction-token v-if="!isAccountLocked" v-for="(total, token) in totalByToken" :key="token" v-model="tokenItemsValid[token]" :token="token" :total="total.toString()" />
      <div class="mainBtnsContainer">
        <div class="mainBtns">
          <defbtn v-if="isAccountLocked" :loader="loading" :disabled="loading" @click="changePubKey()">
            <i class="fas fa-unlock-alt"/>
            <span>Sign the key</span>
          </defbtn>
          <defbtn v-else :disabled="!transferAllowed" @click="transfer()">
            <i class="fas fa-paper-plane"></i>
            <span>Complete payment</span>
          </defbtn>
        </div>
      </div>
    </div>
    <div v-else-if="step==='transfer'" class="w-full">
      <div class="font-firaCondensed font-medium text-3xl text-dark text-center pt-5 md:pt-10">Payment</div>
      <div v-if="subStep==='waitingUserConfirmation'" class="text-lg text-center pt-2">Confirm the transaction to transfer</div>
      <div v-else-if="subStep==='committing'" class="text-lg text-center pt-2">Waiting for the transaction to be mined...</div>
      <loader class="mx-auto mt-6" size="md" color="violet" />
    </div>
    <div v-else-if="step==='success'" class="w-full">
      <div class="font-firaCondensed font-medium text-3xl text-green text-center pt-5 md:pt-10">Thank you!</div>
      <success-mark class="w-11/12 max-w-xxs mx-auto py-5 bigSuccessMark" />
      <div class="text-md text-center font-light pt-2">
        Wasn't that easy? Learn more about <a class="linkDefault" href="https://zksync.io/" target="_blank">zkSync</a>
      </div>
      <line-table-header class="mt-10 md:mt-7 mb-2">
        <template slot="first">Paid</template>
        <template slot="second"></template>
        <template slot="first:md">&nbsp;</template>
        <template slot="right">Paid / TX Hash</template>
      </line-table-header>
      <template v-for="(item,index) in finalTransactions">
        <line-block :key="index">
          <template slot="first">
            <div class="tokenItem">
              <div class="tokenName">{{getTokenByID(typeof(item.txData.tx.token)==='number'?item.txData.tx.token:item.txData.tx.feeToken)}}</div>
            </div>
          </template>
          <template slot="second">
            <div class="amount">{{ item.txData.tx.fee==='0'?item.txData.tx.amount:item.txData.tx.fee | formatToken(getTokenByID(typeof(item.txData.tx.token)==='number'?item.txData.tx.token:item.txData.tx.feeToken)) }}</div>
          </template>
          <template slot="third">
            <a class="transactionLink linkDefault" :href="getTxLink(item.txHash)" target="_blank">
              <!--<span v-if="item.txData.tx.fee!=='0'" class="text-gray text-xs col-span-2">Fee transaction</span>-->
              <div class="font-light txHash text-xxs md:text-right">
                {{item.txHash | formatTransaction}}
              </div>
              <i class="text-xs text-violet pl-1 fal fa-external-link"/>
            </a>
          </template>
        </line-block>
      </template>
      <div class="mainBtnsContainer">
        <div class="mainBtns">
          <defbtn :disabled="!transferAllowed" @click="close()">
            <i class="fas fa-angle-left"></i>
            <span>Back to the website</span>
          </defbtn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { TransactionData, TotalByToken, TransactionFee, Transaction, ZkSyncTransaction} from "@/plugins/types";
import { APP_ZKSYNC_BLOCK_EXPLORER, ETHER_NETWORK_LABEL_LOWERCASED } from "@/plugins/build";
import { changePubKey, transactionBatch } from "@/plugins/walletActions/transaction";

import connectedWallet from "@/blocks/connectedWallet.vue";
import lineTableHeader from "@/blocks/lineTableHeader.vue";
import {ZkSyncCheckoutManager} from "zksync-checkout-internal";

export default Vue.extend({
  components: {
    connectedWallet,
    lineTableHeader,
  },
  data() {
    return {
      modal: false,
      loading: false,
      step: "main" /* main, transfer, success */,
      subStep: "" /* waitingUserConfirmation, committing */,
      tokenItemsValid: {} as {
        [token: string]: Boolean;
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
    currentNetworkName(): string {
      return ETHER_NETWORK_LABEL_LOWERCASED;
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
    transferAllowed(): Boolean {
      for (const [token, state] of Object.entries(this.tokenItemsValid)) {
        if (!state) {
          return false;
        }
      }
      return true;
    },
  },
  methods: {
    getTokenByID(id: number) {
      return this.$store.getters["tokens/getTokenByID"](id)?.symbol;
    },
    getTxLink(hash: string) {
      return `${APP_ZKSYNC_BLOCK_EXPLORER}/transactions/${hash}`;
    },
    async changePubKey() {
      if(this.loading){
        return
      }
      this.loading = true;
      try {
        await changePubKey(this.transactionData.feeToken, this.$store.getters["checkout/getAccountUnlockFee"], this.$store);
      } catch (error) {
        const createErrorModal = (text: string) => {
          this.errorModal = {
            headline: `Activating account error`,
            text,
          };
        };
        if (error.message) {
          if (!error.message.includes("User denied")) {
            if (error.message.includes("Account does not exist in the zkSync network")) {
              createErrorModal("Please, make deposit or request tokens in order to activate the account.");
            } else {
              createErrorModal(error.message);
            }
          }
        } else {
          createErrorModal("Unknown error. Try again later.");
        }
      }
      this.loading = false;
    },
    async transfer() {
      if (this.transferAllowed) {
        const transactionData = this.transactionData;
        const getTransactionFee = this.$store.getters["checkout/getTransactionBatchFee"] as TransactionFee;
        this.step = "transfer";
        this.subStep = "waitingUserConfirmation";
        try {
          let transactionsList = [] as Array<ZkSyncTransaction>;
          transactionsList.push(...transactionData.transactions);
          const transactions = await transactionBatch(transactionsList, transactionData.feeToken, getTransactionFee.amount, !this.isAccountLocked, this.$store);
          console.log("batch transaction", transactions);

          const manager = ZkSyncCheckoutManager.getManager();
          // We need to send the tx hashes to the client long before the
          // awaitReceipt is called
          const hashes = transactions.map((tx: any) => tx.txHash);

          // There is only fee tx
          manager.notifyHashes(hashes.slice(0, -1));

          // @ts-ignore
          this.finalTransactions.push(...transactions);
          this.subStep = "committing";

          await transactions[0].awaitReceipt(); /* Not sure if required. Wait for the first transaction (at least) to be confirmed */
          this.step = "success";
        } catch (error) {
          this.step = "main";
          if (error.message) {
            if (!error.message.includes("User denied")) {
              if (error.message.includes("Account does not exist in the zkSync network")) {
                this.errorModal = {
                  headline: "Payment error",
                  text: "Please, make deposit or request tokens in order to activate the account.",
                };
              }
              else {
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
      }
    },
    close() {
      window.close();
    },
  },
  filters: {
    formatTransaction(value: String) {
      return value.replace('sync-tx:', '');
    }
  }
});
</script>
