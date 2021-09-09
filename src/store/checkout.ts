import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { TotalByToken, TransactionData, ZKInBatchFee } from "~/types/lib.d";
import { Address, TokenSymbol } from "zksync/build/types";
import { ZkSyncTransaction } from "zksync-checkout/src/types";
import { closestPackableTransactionAmount, closestPackableTransactionFee } from "zksync";
import { BigNumber } from "ethers";
import { walletData } from "@/plugins/walletData";

export const state = () => ({
  isError: <boolean>false,
  noDataError: <unknown | undefined>undefined,
  transactions: <ZkSyncTransaction[]>[],
  fromAddress: <Address | undefined>undefined,
  feeToken: <TokenSymbol | undefined>"",
  transactionBatchFee: <ZKInBatchFee | undefined>undefined,
  accountUnlockedFee: <BigNumber | string>"",
});

export type CheckoutModuleState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  getTransactionBatchFee: (state) => state.transactionBatchFee,
  getTransactionData: (state): TransactionData => ({
    transactions: state.transactions,
    fromAddress: state.fromAddress!,
    feeToken: state.feeToken as TokenSymbol,
  }),
  getAccountUnlockFee: (state): string | BigNumber => {
    return state.accountUnlockedFee;
  },
  getAllFees: (state: CheckoutModuleState): ZKInBatchFee[] => {
    if (state.isError) {
      return [];
    }
    const allFees: ZKInBatchFee[] = [];
    allFees.push(state.transactionBatchFee!);
    if (state.accountUnlockedFee && window!.$nuxt!.$accessor!.wallet!.isAccountLocked) {
      allFees.push(<ZKInBatchFee>{
        name: "One-time account activation fee",
        key: "changePubKey",
        amount: state.accountUnlockedFee,
        token: state.feeToken,
      });
    }
    return allFees;
  },
  getTotalByToken: (state, getters): TotalByToken => {
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
      const bigNumber = BigNumber.from(item.amount ? item.amount.toString() : "");
      addToTotalByToken(bigNumber, item.token);
    }
    for (const item of allFees) {
      const bigNumber = BigNumber.from(item.amount ? item.amount.toString() : "");
      addToTotalByToken(bigNumber, item.token);
    }
    return Object.fromEntries(totalByToken);
  },
  getErrorState: (state: CheckoutModuleState): boolean => {
    return state.isError;
  },
  getErrorData: (state: CheckoutModuleState): unknown | undefined => {
    return state.noDataError;
  },
});

export const mutations = mutationTree(state, {
  setTransactionData(state, { transactions, fromAddress, feeToken }: TransactionData): void {
    state.transactions = transactions.map((tx) => {
      return {
        ...tx,
        amount: closestPackableTransactionAmount(tx.amount).toString(),
      };
    });
    state.fromAddress = fromAddress;
    state.feeToken = feeToken;
  },
  setTransactionBatchFee(state, transaction: ZKInBatchFee): void {
    state.transactionBatchFee = transaction;
  },
  setAccountUnlockFee(state, accountUnlockFee: BigNumber = BigNumber.from("")): void {
    state.accountUnlockedFee = accountUnlockFee;
  },
  storeError(state, errorData): void {
    state.isError = !!errorData;
    state.noDataError = errorData;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    setError({ commit }, error: unknown): void {
      commit("storeError", error);
    },
    requestTransactionBatchFee: async ({ state, commit }): Promise<ZKInBatchFee> => {
      const types = new Array(state.transactions.length).fill("Transfer") as "Transfer"[];
      const addresses = state.transactions.map((tx) => tx.to);
      // The fee transaction
      types.push(types[0]);
      addresses.push(addresses[0]);
      const transactionFee = await walletData.get().syncProvider!.getTransactionsBatchFee(types, addresses, state.feeToken!);
      const minFee = BigNumber.from(transactionFee);

      const batchFee = <ZKInBatchFee>{
        name: "Tx Batch Fee / zkSync",
        key: "txBatchFee",
        amount: closestPackableTransactionFee(minFee.add(minFee.div("100").mul("5"))),
        realAmount: transactionFee,
        token: state.feeToken! as TokenSymbol,
      };

      commit("setTransactionBatchFee", batchFee);
      return batchFee;
    },
    async fetchAccountUnlockFee({ state, commit }): Promise<BigNumber> {
      const syncProvider = walletData.get().syncProvider;
      const isAccountLocked = this.getters["wallet/isAccountLocked"];
      let fetchedFee = BigNumber.from("");
      if (isAccountLocked) {
        const syncWallet = walletData.get().syncWallet;
        const foundFee = await syncProvider?.getTransactionFee(
          {
            ChangePubKey: {
              onchainPubkeyAuth: syncWallet?.ethSignerType?.verificationMethod === "ERC-1271",
            },
          },
          syncWallet?.address() || "",
          state.feeToken!,
        );
        fetchedFee = closestPackableTransactionFee(BigNumber.from(foundFee!.totalFee.toString()));
      }
      commit("setAccountUnlockFee", fetchedFee);
      return fetchedFee;
    },
    async closeCheckout(): Promise<void> {},
  },
);