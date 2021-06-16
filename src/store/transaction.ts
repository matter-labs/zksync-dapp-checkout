import { ActionTree, GetterTree, MutationTree } from "vuex";
import { ETHOperation } from "zksync/build/wallet";
import { RootState } from "~/store";

interface depositsInterface {
  [tokenSymbol: string]: Array<{
    hash: string;
    amount: string;
    status: string;
    confirmations: number;
  }>;
}

export const state = () => ({
  deposits: {} as depositsInterface,
  forceUpdateTick: 0,
});

export type TransactionModuleState = ReturnType<typeof state>;

export const mutations: MutationTree<TransactionModuleState> = {
  updateDepositStatus(state, { tokenSymbol, hash, amount, status, confirmations }) {
    if (!Array.isArray(state.deposits[tokenSymbol])) {
      state.deposits[tokenSymbol] = [];
    }
    let txIndex = -1;
    for (let a = 0; a < state.deposits[tokenSymbol].length; a++) {
      if (state.deposits[tokenSymbol][a].hash === hash) {
        txIndex = a;
        break;
      }
    }
    if (txIndex === -1) {
      state.deposits[tokenSymbol].push({
        hash,
        amount,
        status,
        confirmations,
      });
      state.forceUpdateTick++;
    } else {
      state.deposits[tokenSymbol][txIndex].status = status;
      state.forceUpdateTick++;
    }
  },
};

export const getters: GetterTree<TransactionModuleState, RootState> = {
  depositList(state) {
    state.forceUpdateTick;
    return state.deposits;
  },
};

export const actions: ActionTree<TransactionModuleState, RootState> = {
  async watchDeposit({ dispatch, commit }, { depositTx, tokenSymbol, amount }: { depositTx: ETHOperation; tokenSymbol: string; amount: string }): Promise<void> {
    try {
      commit("updateDepositStatus", { hash: depositTx!.ethTx.hash, tokenSymbol, amount, status: "Initiated", confirmations: 1 });
      await depositTx.awaitEthereumTxCommit();
      dispatch("requestBalancesUpdate");
      await depositTx.awaitReceipt();
      dispatch("requestBalancesUpdate");
      commit("updateDepositStatus", { hash: depositTx!.ethTx.hash, tokenSymbol, status: "Commited" });
      await depositTx.awaitVerifyReceipt();
      dispatch("requestBalancesUpdate");
      commit("updateDepositStatus", { hash: depositTx!.ethTx.hash, tokenSymbol, status: "Verified" });
    } catch (error) {
      commit("updateDepositStatus", { hash: depositTx!.ethTx.hash, tokenSymbol, status: "Verified" });
    }
  },
  async requestBalancesUpdate(): Promise<void> {
    await this.dispatch("wallet/getzkBalances", { accountState: undefined, force: true });
  },
};
