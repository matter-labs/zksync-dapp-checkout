import { RootState } from "~/store";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { ZkSyncTransaction, Address, TokenSymbol, transactionData, transactionFee, TotalByToken } from "@/plugins/types";
import { walletData } from "@/plugins/walletData";
import { BigNumber } from "ethers";

export const state = () => ({
  transactions: [] as Array<ZkSyncTransaction>,
  fromAddress: "" as Address,
  feeToken: "" as TokenSymbol,
  transactionFees: [] as Array<transactionFee>,
  accountUnlockedFee: false as (false | BigNumber)
});

export type CheckoutModuleState = ReturnType<typeof state>;

export const mutations: MutationTree<CheckoutModuleState> = {
  setTransactionData(state, {transactions, fromAddress, feeToken}: transactionData) {
    state.transactions = transactions,
    state.fromAddress = fromAddress,
    state.feeToken = feeToken
  },
  setTransactionFees(state, transactionFees: Array<transactionFee>) {
    state.transactionFees = transactionFees;
  },
  setAccountUnlockFee(state, accountUnlockFee: (false | BigNumber)) {
    state.accountUnlockedFee = accountUnlockFee;
  },
};

export const getters: GetterTree<CheckoutModuleState, RootState> = {
  getTransactionData(state): transactionData {
    return {
      transactions: state.transactions,
      fromAddress: state.fromAddress,
      feeToken: state.feeToken
    };
  },
  getTransactionFees(state): Array<transactionFee> {
    return state.transactionFees;
  },
  getAccountUnlockFee(state): (false | BigNumber) {
    return state.accountUnlockedFee;
  },
  getAllFees(state): Array<transactionFee> {
    var allFees = [...state.transactionFees] as Array<transactionFee>;
    if(state.accountUnlockedFee) {
      allFees.push({
        name: 'One-time account unlock fee',
        amount: state.accountUnlockedFee,
        token: state.feeToken
      });
    }
    return allFees;
  },
  getTotalByToken(state, getters): TotalByToken {
    const allFees = getters['getAllFees'];
    var totalByToken = new Map();
    const addToTotalByToken = (amount: BigNumber, token: TokenSymbol) => {
      if(totalByToken.has(token)) {
        totalByToken.set(token, totalByToken.get(token).add(amount));
      }
      else {
        totalByToken.set(token, amount);
      }
    }
    for(const item of state.transactions) {
      addToTotalByToken(BigNumber.from(item.amount), item.token);
    }
    for(const item of allFees) {
      addToTotalByToken(item.amount, item.token);
    }
    return Object.fromEntries(totalByToken)
  },
}

export const actions: ActionTree<CheckoutModuleState, RootState> = {
  async getTransactionFees({state, commit}): Promise<void> {
    let tranasctionFees = [] as Array<transactionFee>;
    const syncProvider = walletData.get().syncProvider;
    await this.dispatch("wallet/restoreProviderConnection");
    const types = new Array(state.transactions.length).fill('Transfer') as "Transfer"[];
    const addresses = state.transactions.map(tx => tx.to);

    // The fee transaction
    types.push(types[0]);
    addresses.push(addresses[0]);
    const transactionFee = await syncProvider!.getTransactionsBatchFee(types, addresses, state.feeToken);
    tranasctionFees.push({
      name: 'Tx Batch Fee / zkSync',
      amount: BigNumber.from(transactionFee),
      token: state.feeToken
    });
    commit('setTransactionFees', tranasctionFees);
  },
  async getAccountUnlockedFee({state, commit}): Promise<void> {
    const syncProvider = walletData.get().syncProvider;
    const isAccountLocked = this.getters['wallet/isAccountLocked'];
    await this.dispatch("wallet/restoreProviderConnection");
    if(isAccountLocked) {
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
      commit('setAccountUnlockFee', BigNumber.from(foundFee!.totalFee.toString()));
    }
    else {
      commit('setAccountUnlockFee', false);
    }
  },
  async closeCheckout(): Promise<void> {
    
  },
};
