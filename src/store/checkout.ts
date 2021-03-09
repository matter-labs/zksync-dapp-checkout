import { ActionTree, GetterTree, MutationTree } from "vuex";
import { ZkSyncTransaction, Address, TokenSymbol, TransactionData, TransactionFee, TotalByToken } from "@/plugins/types";
import { closestPackableTransactionAmount } from "zksync";
import { BigNumber } from "ethers";
import { walletData } from "@/plugins/walletData";
import { RootState } from "~/store";

export const state = () => ({
  transactions: [] as Array<ZkSyncTransaction>,
  fromAddress: "" as Address,
  feeToken: "" as TokenSymbol,
  transactionBatchFee: {} as TransactionFee,
  accountUnlockedFee: false as false | BigNumber,
});

export type CheckoutModuleState = ReturnType<typeof state>;

export const mutations: MutationTree<CheckoutModuleState> = {
  setTransactionData(state, { transactions, fromAddress, feeToken }: TransactionData) {
    state.transactions = transactions.map((tx) => {
      return {
        ...tx,
        amount: closestPackableTransactionAmount(tx.amount).toString(),
      };
    });
    state.fromAddress = fromAddress;
    state.feeToken = feeToken;
  },
  setTransactionBatchFee(state, transaction: TransactionFee) {
    state.transactionBatchFee = transaction;
  },
  setAccountUnlockFee(state, accountUnlockFee: false | BigNumber) {
    state.accountUnlockedFee = accountUnlockFee;
  },
};

export const getters: GetterTree<CheckoutModuleState, RootState> = {
  getTransactionData(state): TransactionData {
    return {
      transactions: state.transactions,
      fromAddress: state.fromAddress,
      feeToken: state.feeToken,
    };
  },
  getTransactionBatchFee(state): TransactionFee {
    return state.transactionBatchFee;
  },
  getAccountUnlockFee(state): false | BigNumber {
    return state.accountUnlockedFee;
  },
  getAllFees(state: /* Vuex store state */ any, getters, rootState, rootGetters: /* Vuex store getters */ any): Array<TransactionFee> {
    const allFees = [] as Array<TransactionFee>;
    allFees.push(state.transactionBatchFee);
    if (state.accountUnlockedFee && rootGetters["wallet/isAccountLocked"]) {
      allFees.push({
        name: "One-time account unlock fee",
        key: "changePubKey",
        amount: state.accountUnlockedFee,
        token: state.feeToken,
      });
    }
    return allFees;
  },
  getTotalByToken(state, getters): TotalByToken {
    const allFees = getters.getAllFees;
    const totalByToken = new Map();
    const addToTotalByToken = (amount: BigNumber, token: TokenSymbol) => {
      if (totalByToken.has(token)) {
        totalByToken.set(token, totalByToken.get(token).add(amount));
      } else {
        totalByToken.set(token, amount);
      }
    };
    for (const item of state.transactions) {
      addToTotalByToken(BigNumber.from(item.amount), item.token);
    }
    for (const item of allFees) {
      addToTotalByToken(item.amount, item.token);
    }
    return Object.fromEntries(totalByToken);
  },
};

export const actions: ActionTree<CheckoutModuleState, RootState> = {
  async getTransactionBatchFee({ state, commit }): Promise<void> {
    const syncProvider = walletData.get().syncProvider;
    await this.dispatch("wallet/restoreProviderConnection");
    const types = new Array(state.transactions.length).fill("Transfer") as "Transfer"[];
    const addresses = state.transactions.map((tx) => tx.to);

    // The fee transaction
    types.push(types[0]);
    addresses.push(addresses[0]);
    const transactionFee = await syncProvider!.getTransactionsBatchFee(types, addresses, state.feeToken);
    commit("setTransactionBatchFee", {
      name: "Tx Batch Fee / zkSync",
      key: "txBatchFee",
      amount: BigNumber.from(transactionFee),
      token: state.feeToken,
    });
  },
  async getAccountUnlockFee({ state, commit }): Promise<void> {
    const syncProvider = walletData.get().syncProvider;
    const isAccountLocked = this.getters["wallet/isAccountLocked"];
    await this.dispatch("wallet/restoreProviderConnection");
    if (isAccountLocked) {
      const syncWallet = walletData.get().syncWallet;
      const foundFee = await syncProvider?.getTransactionFee(
        {
          ChangePubKey: {
            onchainPubkeyAuth: syncWallet?.ethSignerType?.verificationMethod === "ERC-1271",
          },
        },
        syncWallet?.address() || "",
        state.feeToken,
      );
      commit("setAccountUnlockFee", BigNumber.from(foundFee!.totalFee.toString()));
    } else {
      commit("setAccountUnlockFee", false);
    }
  },
  async closeCheckout(): Promise<void> {},
};
