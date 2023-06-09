/* eslint-disable require-await */
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { ZkSyncTransaction } from "zksync-checkout/build/types";
import { closestPackableTransactionAmount, closestPackableTransactionFee, RestProvider } from "@rsksmart/rif-rollup-js-sdk";
import { TokenSymbol, Address } from "@rsksmart/rif-rollup-js-sdk/build/types";
import { BigNumber } from "ethers";
import { ZkFee } from "@rsksmart/rif-rollup-nuxt-core/types";
import { RootState } from "~/store";
import { TransactionData, TransactionFee, TotalByToken } from "@/types/index";

export const state = () => ({
  linkCheckout: <boolean>false,
  isError: <boolean>false,
  noDataError: <unknown | undefined>undefined,
  transactions: [] as Array<ZkSyncTransaction>,
  fromAddress: "" as Address,
  feeToken: undefined as TokenSymbol | undefined,
  allowedRampZkTokens: ["ETH", "DAI", "USDT", "USDC"] as TokenSymbol[],
  confirmationsAmount: <number | undefined>undefined,
  domains: new Map<Address, string>(),
});

export type CheckoutModuleState = ReturnType<typeof state>;

export const getters: GetterTree<CheckoutModuleState, RootState> = {
  getTransactionData(state, _, __): TransactionData {
    return {
      transactions: state.transactions,
      fromAddress: state.fromAddress,
      feeToken: state.feeToken!,
      domains: state.domains,
    };
  },
  getTransactionBatchFee(_, __, ___, rootGetters): false | TransactionFee {
    // eslint-disable-next-line no-unused-expressions
    rootGetters["zk-transaction/feeLoading"];
    if (rootGetters["zk-transaction/fee"]) {
      const minFee = BigNumber.from(rootGetters["zk-transaction/fee"]);
      return {
        key: "txBatchFee",
        amount: closestPackableTransactionFee(minFee.add(minFee.div("100").mul("5").toString()).toString()),
        realAmount: minFee,
        token: rootGetters["zk-transaction/feeSymbol"],
      };
    }
    return false;
  },
  getAccountUnlockFee(_, __, ___, rootGetters): false | BigNumber {
    // eslint-disable-next-line no-unused-expressions
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
    const allFees = rootGetters["zk-transaction/fees"].map((e: ZkFee) => ({
      ...e,
      token: rootGetters["zk-transaction/feeSymbol"],
    }));
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
  getConfirmationsAmount(state: CheckoutModuleState): number | undefined {
    return state.confirmationsAmount;
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
  setTransactionData(state, { transactions, fromAddress, domains }: TransactionData) {
    state.transactions = transactions.map((tx) => {
      return {
        ...tx,
        amount: closestPackableTransactionAmount(tx.amount).toString(),
      };
    });
    state.fromAddress = fromAddress;
    state.domains = domains;
  },
  setError(state: CheckoutModuleState, errorData) {
    state.isError = !!errorData;
    state.noDataError = errorData;
  },
  setAllowedRampZkTokens(state: CheckoutModuleState, tokens: TokenSymbol[]) {
    state.allowedRampZkTokens = tokens;
  },
  setConfirmationsAmount(state: CheckoutModuleState, confirmationsAmount: number) {
    state.confirmationsAmount = confirmationsAmount;
  },
};

export const actions: ActionTree<CheckoutModuleState, RootState> = {
  async setTransactionData({ commit, dispatch, rootGetters }, data: TransactionData) {
    commit("setTransactionData", data);
    commit(
      "zk-transaction/setTransferBatch",
      [
        ...data.transactions.map((e) => ({ address: e.to, token: e.token })),
        {
          address: rootGetters["zk-account/address"] ? rootGetters["zk-account/address"] : data.transactions[0].to,
          token: data.feeToken,
        },
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
      allowanceArr.push(dispatch("zk-balances/requestAllowance", { force: true, symbol }, { root: true }));
    }
    await Promise.all([
      dispatch("zk-transaction/requestAllFees", true, { root: true }),
      dispatch("requestUsedTokensPrice"),
      dispatch("requestConfirmationsAmount"),
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
  async requestConfirmationsAmount({ getters, commit, dispatch }): Promise<void> {
    if (getters.confirmationsAmount) {
      return;
    }
    const syncProvider: RestProvider = await dispatch("zk-provider/requestProvider", null, { root: true });
    const confirmationsAmount = await syncProvider.getConfirmationsForEthOpAmount();
    commit("setConfirmationsAmount", confirmationsAmount);
  },
  async requestUsedTokensEthereumBalance({ getters, dispatch }, force = false): Promise<void> {
    const usedTokens = getters.usedTokens;
    const balancesPromises = [];
    for (const symbol of usedTokens) {
      balancesPromises.push(dispatch("zk-balances/requestEthereumBalance", { symbol, force }, { root: true }));
    }
    await Promise.all(balancesPromises);
  },
  async setFeeToken({ commit, dispatch }, feeToken: TokenSymbol): Promise<void> {
    commit("setFeeToken", feeToken);
    dispatch("zk-tokens/getTokenPrice", feeToken, { root: true });
    dispatch("zk-transaction/setSymbol", feeToken, { root: true });
  },
};
