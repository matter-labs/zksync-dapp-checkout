import { ActionTree, GetterTree, MutationTree } from "vuex";
import { TransactionData, TransactionFee, TotalByToken } from "@/types/index";
import { ZkSyncTransaction } from "zksync-checkout/src/types";
import { closestPackableTransactionAmount, closestPackableTransactionFee } from "zksync";
import { TokenSymbol, Address } from "zksync/build/types";
import { BigNumber } from "ethers";
import { RootState } from "~/store";
import { ZkFee } from "@matterlabs/zksync-nuxt-core/types";
import { rampConfig } from "@/plugins/build";

export const state = () => ({
  linkCheckout: <boolean>false,
  isError: <boolean>false,
  noDataError: <unknown | undefined>undefined,
  transactions: [] as Array<ZkSyncTransaction>,
  fromAddress: "" as Address,
  feeToken: undefined as TokenSymbol | undefined,
  allowedRampZkTokens: ["ETH", "DAI", "USDT", "USDC"] as TokenSymbol[],
});

export type CheckoutModuleState = ReturnType<typeof state>;

export const getters: GetterTree<CheckoutModuleState, RootState> = {
  getTransactionData(state, _, __): TransactionData {
    return {
      transactions: state.transactions,
      fromAddress: state.fromAddress,
      feeToken: state.feeToken!,
    };
  },
  getTransactionBatchFee(_, __, ___, rootGetters): false | TransactionFee {
    rootGetters["zk-transaction/feeLoading"];
    if (rootGetters["zk-transaction/fee"]) {
      const minFee = BigNumber.from(rootGetters["zk-transaction/fee"]);
      return {
        // name: "Tx Batch Fee / zkSync",
        key: "txBatchFee",
        amount: closestPackableTransactionFee(minFee.add(minFee.div("100").mul("5").toString()).toString()),
        realAmount: minFee,
        token: rootGetters["zk-transaction/feeSymbol"],
      };
    }
    return false;
  },
  getAccountUnlockFee(_, __, ___, rootGetters): false | BigNumber {
    rootGetters["zk-transaction/activationFeeLoading"];
    return rootGetters["zk-transaction/accountActivationFee"];
  },
  usedTokens(state, _, __, rootGetters): TokenSymbol[] {
    const tokens: Set<string> = new Set();
    tokens.add(rootGetters["zk-transaction/feeSymbol"]);
    for (const item of state.transactions) {
      tokens.add(item.token);
    }
    return Array.from(tokens);
  },
  getTotalByToken(state, _, __, rootGetters): TotalByToken {
    const allFees = rootGetters["zk-transaction/fees"].map((e: ZkFee) => ({ ...e, token: rootGetters["zk-transaction/feeSymbol"] }));
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
  getErrorState(state: CheckoutModuleState): boolean {
    return state.isError;
  },
  getErrorData(state: CheckoutModuleState): unknown | undefined {
    return state.noDataError;
  },
  getAllowedRampZkTokens(state: CheckoutModuleState): TokenSymbol[] {
    return state.allowedRampZkTokens;
  },
  isLinkCheckout(state: CheckoutModuleState): boolean {
    return state.linkCheckout;
  },
};

export const mutations: MutationTree<CheckoutModuleState> = {
  setLinkCheckoutState(state, status: boolean) {
    state.linkCheckout = status;
  },
  setFeeToken(state, feeToken: TokenSymbol) {
    state.feeToken = feeToken;
  },
  setTransactionData(state, { transactions, fromAddress }: TransactionData) {
    state.transactions = transactions.map((tx) => {
      return {
        ...tx,
        amount: closestPackableTransactionAmount(tx.amount).toString(),
      };
    });
    state.fromAddress = fromAddress;
  },
  setError(state: CheckoutModuleState, errorData) {
    state.isError = !!errorData;
    state.noDataError = errorData;
  },
  setAllowedRampZkTokens(state: CheckoutModuleState, tokens: TokenSymbol[]) {
    state.allowedRampZkTokens = tokens;
  },
};

export const actions: ActionTree<CheckoutModuleState, RootState> = {
  async setTransactionData({ commit, dispatch, rootGetters }, data: TransactionData) {
    commit("setTransactionData", data);
    commit(
      "zk-transaction/setTransferBatch",
      [
        ...data.transactions.map((e) => ({ address: e.to, token: e.token })),
        { address: rootGetters["zk-account/address"] ? rootGetters["zk-account/address"] : data.transactions[0].to, token: data.feeToken },
      ],
      { root: true }
    );
    commit("setFeeToken", data.feeToken);
    dispatch("zk-transaction/setType", "TransferBatch", { root: true });
    dispatch("zk-transaction/setSymbol", data.feeToken, { root: true });
  },
  async requestInitialData({ getters, dispatch }) {
    const usedTokens = getters.usedTokens;
    const allowanceArr = [];
    for (const symbol of usedTokens) {
      allowanceArr.push(dispatch("zk-balances/requestAllowance", { force: true, symbol: symbol }, { root: true }));
    }
    await Promise.all([
      dispatch("zk-transaction/requestAllFees", true, { root: true }),
      dispatch("requestUsedTokensPrice"),
      dispatch("requestUsedTokensEthereumBalance", true),
      ...allowanceArr,
    ]);
  },
  async requestUsedTokensPrice({ getters, dispatch }): Promise<void> {
    const usedTokens = getters.usedTokens;
    for (const symbol of usedTokens) {
      dispatch("zk-tokens/getTokenPrice", symbol, { root: true });
    }
  },
  async requestUsedTokensEthereumBalance({ getters, dispatch }, force = false): Promise<void> {
    const usedTokens = getters.usedTokens;
    const balancesPromises = [];
    for (const symbol of usedTokens) {
      balancesPromises.push(dispatch("zk-balances/requestEthereumBalance", { symbol, force }, { root: true }));
    }
    await Promise.all(balancesPromises);
  },
};