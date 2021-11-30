import { BigNumber, BigNumberish, Contract, ContractInterface, ethers } from "ethers";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { Address, Balance, GweiBalance, Token, TokenSymbol, TotalByToken, Transaction } from "@/types/index";
import { ERC20_APPROVE_TRESHOLD, IERC20_INTERFACE } from "zksync/build/utils";

import Onboard from "@matterlabs/zk-wallet-onboarding";

import onboardConfig from "@/plugins/onboardConfig";
import web3Wallet from "@/plugins/web3";
import utils from "@/plugins/utils";
import watcher from "@/plugins/watcher";
import { ETHER_NETWORK_NAME, ZK_API_BASE } from "@/plugins/build";

import { walletData } from "@/plugins/walletData";
import { RootState } from "~/store";

interface feesInterface {
  [symbol: string]: {
    [feeSymbol: string]: {
      [type: string]: {
        [address: string]: {
          normal: GweiBalance;
          fast: GweiBalance;
        };
      };
    };
  };
}

const getTransactionHistoryAgain = false;

export const state = () => ({
  onboard: false as any,
  isAccountLocked: false,
  zkTokens: {
    lastUpdated: 0 as number,
    list: [] as Array<Balance>,
  },
  initialTokens: {
    lastUpdated: 0 as number,
    list: [] as Array<Balance>,
  },
  tokenPrices: {} as {
    [symbol: string]: {
      lastUpdated: number;
      price: number;
    };
  },
  transactionsHistory: {
    lastUpdated: 0 as number,
    list: [] as Array<Transaction>,
  },
  withdrawalProcessingTime: false as
    | false
    | {
        normal: number;
        fast: number;
      },
  fees: {} as feesInterface,
});

export type WalletModuleState = ReturnType<typeof state>;

export const mutations: MutationTree<WalletModuleState> = {
  setAccountLockedState(state, accountState: boolean) {
    state.isAccountLocked = accountState;
  },
  setOnboard(state, obj: any) {
    state.onboard = obj;
  },
  setTokensList(
    state,
    obj: {
      lastUpdated: number;
      list: Array<Balance>;
    },
  ) {
    state.initialTokens = obj;
  },
  setZkTokens(
    state,
    obj: {
      lastUpdated: number;
      list: Array<Balance>;
    },
  ) {
    state.zkTokens = obj;
  },
  setTokenPrice(
    state,
    {
      symbol,
      obj,
    }: {
      symbol: TokenSymbol;
      obj: {
        lastUpdated: number;
        price: number;
      };
    },
  ) {
    state.tokenPrices[symbol] = obj;
  },
  setTransactionsList(
    state,
    obj: {
      lastUpdated: number;
      list: Array<Transaction>;
    },
  ) {
    state.transactionsHistory = obj;
  },
  setWithdrawalProcessingTime(
    state,
    obj: {
      normal: number;
      fast: number;
    },
  ) {
    state.withdrawalProcessingTime = obj;
  },
  setFees(
    state,
    {
      symbol,
      feeSymbol,
      type,
      address,
      obj,
    }: {
      symbol: TokenSymbol;
      feeSymbol: TokenSymbol;
      type: string;
      address: Address;
      obj: {
        normal: GweiBalance;
        fast: GweiBalance;
      };
    },
  ) {
    if (!state.fees.hasOwnProperty(symbol)) {
      state.fees[symbol] = {};
    }
    if (!state.fees[symbol].hasOwnProperty(feeSymbol)) {
      state.fees[symbol][feeSymbol] = {};
    }
    if (!state.fees[symbol][feeSymbol].hasOwnProperty(type)) {
      state.fees[symbol][feeSymbol][type] = {};
    }
    state.fees[symbol][feeSymbol][type][address] = obj as {
      normal: GweiBalance;
      fast: GweiBalance;
    };
  },
  setZkBalanceStatus(state, { status, tokenSymbol }) {
    for (const item of state.zkTokens.list) {
      if (item.symbol === tokenSymbol) {
        item.status = status;
        break;
      }
    }
  },
  clearDataStorage(state) {
    state.zkTokens = {
      lastUpdated: 0,
      list: [],
    };
    state.initialTokens = {
      lastUpdated: 0,
      list: [],
    };
    state.transactionsHistory = {
      lastUpdated: 0,
      list: [],
    };
    state.fees = {};
  },
};

export const getters: GetterTree<WalletModuleState, RootState> = {
  isAccountLocked(state): boolean {
    return state.isAccountLocked;
  },
  getOnboard(state): any {
    return state.onboard;
  },
  getTokensList(state): { lastUpdated: number; list: Array<Balance> } {
    return state.initialTokens;
  },
  getInitialBalances(state): Array<Balance> {
    return state.initialTokens.list;
  },
  getzkList(state): { lastUpdated: number; list: Array<Balance> } {
    return state.zkTokens;
  },
  getzkBalances(state): Array<Balance> {
    return state.zkTokens.list;
  },
  getTransactionsHistory(state): Array<Transaction> {
    return state.transactionsHistory.list;
  },
  getTokenPrices(
    state,
  ): {
    [symbol: string]: {
      lastUpdated: number;
      price: number;
    };
  } {
    return state.tokenPrices;
  },
  getTransactionsList(
    state,
  ): {
    lastUpdated: number;
    list: Array<Transaction>;
  } {
    return state.transactionsHistory;
  },
  getWithdrawalProcessingTime(
    state,
  ):
    | false
    | {
        normal: number;
        fast: number;
      } {
    return state.withdrawalProcessingTime;
  },
  getFees(state): feesInterface {
    return state.fees;
  },
  isLoggedIn(): boolean {
    return !!(walletData.get().syncWallet && walletData.get().syncWallet?.address);
  },
};

interface InitialBalance {
  id: any;
  address: any;
  balance: string;
  rawBalance: BigNumber;
  formattedBalance: string;
  symbol: any;
  unlocked: BigNumber;
}

export const actions: ActionTree<WalletModuleState, RootState> = {
  /**
   * Initial call, connecting to the wallet
   * @param commit
   * @return {Promise<boolean>}
   */
  async onboard({ commit }): Promise<boolean> {
    const onboard = Onboard(onboardConfig(this));
    commit("setOnboard", onboard);
    const previouslySelectedWallet = window.localStorage.getItem("selectedWallet");
    if (!previouslySelectedWallet) {
      this.commit("account/setSelectedWallet", "");
      return false;
    } else {
      this.dispatch("toaster/info", "Found previously selected wallet.");
      this.commit("account/setSelectedWallet", previouslySelectedWallet);
    }
    return await onboard.walletSelect(previouslySelectedWallet);
  },

  /**
   * Check if the connection to the sync provider is opened and if not - restore it
   */
  async restoreProviderConnection(): Promise<void> {
    const syncProvider = walletData.get().syncProvider;
    if (syncProvider && syncProvider.transport.ws && !syncProvider.transport.ws.isOpened) {
      await syncProvider.transport.ws.open();
    }
  },

  /**
   *
   * @param commit
   * @param dispatch
   * @param getters
   * @param accountState
   * @param force
   * @return {Promise<[array]|*>}
   */
  async getzkBalances({ commit, dispatch, getters }, { accountState, force = false } = { accountState: undefined, force: false }): Promise<Array<Balance>> {
    let listCommitted = {} as {
      [token: string]: BigNumberish;
    };
    let listVerified = {} as {
      [token: string]: BigNumberish;
    };
    const tokensList = [] as Array<Balance>;
    const syncWallet = walletData.get().syncWallet;
    if (accountState) {
      listCommitted = accountState.committed.balances;
      listVerified = accountState.verified.balances;
    } else {
      const localList = getters.getzkList;
      if (!force && localList.lastUpdated > new Date().getTime() - 60000) {
        return localList.list;
      }
      await dispatch("restoreProviderConnection");
      const newAccountState = await syncWallet!.getAccountState();
      this.commit("account/setAccountID", newAccountState.id);
      walletData.set({ accountState: newAccountState });
      listCommitted = newAccountState?.committed.balances || {};
      listVerified = newAccountState?.verified.balances || {};
    }
    const restrictedTokens = this.getters["tokens/getRestrictedTokens"];
    const totalByToken = this.getters["checkout/getTotalByToken"];
    const usedTokens = Object.entries(totalByToken).map((e) => e[0]);

    for (const tokenSymbol of usedTokens) {
      const price = await this.dispatch("tokens/getTokenPrice", tokenSymbol);
      if (listCommitted.hasOwnProperty(tokenSymbol)) {
        const committedBalance = utils.handleFormatToken(tokenSymbol, listCommitted[tokenSymbol] ? listCommitted[tokenSymbol].toString() : "0");
        const verifiedBalance = utils.handleFormatToken(tokenSymbol, listVerified[tokenSymbol] ? listVerified[tokenSymbol].toString() : "0");
        tokensList.push({
          symbol: tokenSymbol,
          status: committedBalance !== verifiedBalance ? "Pending" : "Verified",
          balance: committedBalance,
          rawBalance: BigNumber.from(listCommitted[tokenSymbol] ? listCommitted[tokenSymbol] : "0"),
          verifiedBalance,
          tokenPrice: price,
          restricted: +committedBalance <= 0 || restrictedTokens.hasOwnProperty(tokenSymbol),
        } as Balance);
      } else {
        tokensList.push({
          symbol: tokenSymbol,
          status: "Pending",
          balance: "0",
          rawBalance: BigNumber.from("0"),
          verifiedBalance: "0",
          tokenPrice: price,
          restricted: true,
        } as Balance);
      }
    }
    commit("setZkTokens", {
      lastUpdated: new Date().getTime(),
      list: tokensList.sort(utils.sortBalancesById),
    });
    return tokensList;
  },

  /**
   * @param dispatch
   * @param commit
   * @param getters
   * @param force
   * @return {Promise<*[]|*>}
   */
  async getInitialBalances({ dispatch, commit, getters }, force = false): Promise<Array<Token>> {
    const localList = getters.getTokensList;

    if (!force && localList.lastUpdated > new Date().getTime() - 60000) {
      return localList.list;
    }
    await dispatch("restoreProviderConnection");
    const syncWallet = walletData.get().syncWallet;
    if (!syncWallet) {
      return localList.list;
    }
    const loadedTokens = await this.dispatch("tokens/loadAllTokens");
    const totalByToken: TotalByToken = this.getters["checkout/getTotalByToken"];
    const usedTokens: string[] = Object.entries(totalByToken).map((e: [string, BigNumber]) => e[0]);

    const loadInitialBalancesPromises = usedTokens.map(
      async (key: string): Promise<InitialBalance | void> => {
        const currentToken = loadedTokens[key];
        try {
          const balance = await syncWallet.getEthereumBalance(key);
          let unlocked: BigNumber;
          if (currentToken.symbol.toLowerCase() !== "eth") {
            const tokenAddress = syncWallet!.provider.tokenSet.resolveTokenAddress(currentToken.symbol);
            const erc20contract = new Contract(tokenAddress, IERC20_INTERFACE as ContractInterface, syncWallet!.ethSigner);
            unlocked = await erc20contract.allowance(syncWallet!.address(), syncWallet!.provider.contractAddress.mainContract);
          } else {
            unlocked = BigNumber.from(ERC20_APPROVE_TRESHOLD);
          }
          return <InitialBalance>{
            id: currentToken.id,
            address: currentToken.address,
            balance: utils.handleFormatToken(currentToken.symbol, balance ? balance.toString() : "0"),
            rawBalance: balance,
            formattedBalance: utils.handleFormatToken(currentToken.symbol, balance.toString()),
            symbol: currentToken.symbol,
            unlocked,
          };
        } catch (error) {
          this.dispatch("toaster/error", `Error getting ${currentToken.symbol} balance`);
        }
      },
    );
    const balancesResults = await Promise.all(loadInitialBalancesPromises).catch((err) => {
      console.log("Get balances error", err);
      // @todo insert sentry logging
      return [];
    });
    commit("setTokensList", {
      lastUpdated: new Date().getTime(),
      list: balancesResults,
    });
    return balancesResults as Array<Token>;
  },

  /**
   *
   * @param dispatch
   * @param commit
   * @param getters
   * @param options
   * @return {Promise<any>}
   */
  async getTransactionsHistory({ dispatch, commit, getters }, options): Promise<Array<Transaction>> {
    // @ts-ignore: Unreachable code error
    clearTimeout(getTransactionHistoryAgain);
    const localList = getters.getTransactionsList;
    if (!options) {
      options = {
        force: false,
        offset: 0,
      };
    } else {
      if (options.force === undefined) {
        options.force = false;
      }
      if (options.offset === undefined) {
        options.offset = 0;
      }
    }
    if (options.force === false && localList.lastUpdated > new Date().getTime() - 30000 && options.offset === 0) {
      return localList.list;
    }
    try {
      const syncWallet = walletData.get().syncWallet;
      const fetchTransactionHistory = await this.app.$axios.get(`https://${ZK_API_BASE}/api/v0.1/account/${syncWallet?.address()}/history/${options.offset}/25`);
      commit("setTransactionsList", {
        lastUpdated: new Date().getTime(),
        list: options.offset === 0 ? fetchTransactionHistory.data : [...localList.list, ...fetchTransactionHistory.data],
      });
      return fetchTransactionHistory.data;
    } catch (error) {
      this.dispatch("toaster/error", error.message);
      return localList.list;
    }
  },
  async getWithdrawalProcessingTime({
    getters,
    commit,
  }): Promise<{
    normal: number;
    fast: number;
  }> {
    if (getters.getWithdrawalProcessingTime) {
      return getters.getWithdrawalProcessingTime;
    } else {
      const withdrawTime = await this.app.$axios.get(`https://${ZK_API_BASE}/api/v0.1/withdrawal_processing_time`);
      commit("setWithdrawalProcessingTime", withdrawTime.data);
      return withdrawTime.data;
    }
  },
  async getFees(
    { getters, commit, dispatch },
    { address, symbol, feeSymbol, type },
  ): Promise<{
    fast?: number;
    normal: number;
  }> {
    const savedFees = getters.getFees;
    if (
      savedFees &&
      savedFees.hasOwnProperty(symbol) &&
      savedFees[symbol].hasOwnProperty(feeSymbol) &&
      savedFees[symbol][feeSymbol].hasOwnProperty(type) &&
      savedFees[symbol][feeSymbol][type].hasOwnProperty(address)
    ) {
      return savedFees[symbol][feeSymbol][type][address];
    } else {
      const syncProvider = walletData.get().syncProvider;
      const syncWallet = walletData.get().syncWallet;
      await dispatch("restoreProviderConnection");
      const zksync = await walletData.zkSync();
      if (type === "withdraw") {
        if (symbol === feeSymbol) {
          const foundFeeFast = await syncProvider!.getTransactionFee("FastWithdraw", address, symbol);
          const foundFeeNormal = await syncProvider!.getTransactionFee("Withdraw", address, symbol);
          const feesObj = {
            fast: zksync.closestPackableTransactionFee(foundFeeFast.totalFee),
            normal: zksync.closestPackableTransactionFee(foundFeeNormal.totalFee),
          };
          commit("setFees", { symbol, feeSymbol, type, address, obj: feesObj });
          return feesObj;
        } else {
          const batchWithdrawFeeFast = await syncProvider!.getTransactionsBatchFee(["FastWithdraw", "Transfer"], [address, syncWallet!.address()], feeSymbol);
          const batchWithdrawFeeNormal = await syncProvider!.getTransactionsBatchFee(["Withdraw", "Transfer"], [address, syncWallet!.address()], feeSymbol);
          const feesObj = {
            fast: zksync.closestPackableTransactionFee(batchWithdrawFeeFast),
            normal: zksync.closestPackableTransactionFee(batchWithdrawFeeNormal),
          };
          commit("setFees", { symbol, feeSymbol, type, address, obj: feesObj });
          return feesObj;
        }
      } else if (symbol === feeSymbol) {
        const foundFeeNormal = await syncProvider!.getTransactionFee("Transfer", address, symbol);
        const totalFeeValue = zksync.closestPackableTransactionFee(foundFeeNormal.totalFee);
        const feesObj = {
          normal: totalFeeValue,
        };
        commit("setFees", { symbol, feeSymbol, type, address, obj: feesObj });
        return feesObj;
      } else {
        const batchTransferFee = await syncProvider!.getTransactionsBatchFee(["Transfer", "Transfer"], [address, syncWallet!.address()], feeSymbol);
        const feesObj = {
          normal: zksync.closestPackableTransactionFee(batchTransferFee),
        };
        commit("setFees", { symbol, feeSymbol, type, address, obj: feesObj });
        return feesObj;
      }
    }
  },
  async checkLockedState({ commit }): Promise<void> {
    const pubKeyHash = await walletData.get().syncWallet!.signer!.pubKeyHash();
    commit("setAccountLockedState", pubKeyHash !== walletData.get().accountState!.committed.pubKeyHash);
  },
  async getProviders(): Promise<void> {
    const zksync = await walletData.zkSync();
    const syncProvider = await zksync.getDefaultProvider(ETHER_NETWORK_NAME /* , 'HTTP' */);
    walletData.set({ syncProvider });
  },
  async walletRefresh({ getters, dispatch }, firstSelect: boolean = true): Promise<boolean> {
    try {
      const onboard = getters.getOnboard;
      this.commit("account/setLoadingHint", "processing");
      let walletCheck = false;
      if (firstSelect) {
        walletCheck = await onboard.walletSelect();
        if (!walletCheck) {
          return false;
        }
      }
      walletCheck = await onboard.walletCheck();
      if (!walletCheck) {
        return false;
      }
      if (!web3Wallet.get().eth) {
        return false;
      }
      const getAccounts = await web3Wallet.get().eth.getAccounts();
      if (getAccounts.length === 0) {
        return false;
      }
      const transactionData = this.getters["checkout/getTransactionData"];
      if (typeof transactionData.fromAddress === "string" && transactionData.fromAddress.toLowerCase() !== getAccounts[0].toLowerCase()) {
        this.commit("setCurrentModal", "wrongAccountAddress");
        return false;
      }
      if (walletData.get().syncWallet) {
        this.commit("account/setAddress", walletData.get().syncWallet!.address());
        this.commit("account/setLoggedIn", true);
        return true;
      }

      /**
       * @type {provider}
       */
      const currentProvider = web3Wallet.get().eth.currentProvider;
      /**
       * noinspection ES6ShorthandObjectProperty
       */
      const ethWallet = new ethers.providers.Web3Provider(currentProvider).getSigner();

      const zksync = await walletData.zkSync();
      await dispatch("restoreProviderConnection");
      this.commit("account/setLoadingHint", "followInstructions");
      const syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, walletData.get().syncProvider);

      this.commit("account/setLoadingHint", "loadingData");
      const accountState = await syncWallet.getAccountState();

      walletData.set({ syncWallet, accountState, ethWallet });

      await dispatch("getzkBalances", { accountState, force: true });
      await dispatch("getInitialBalances", true);

      await dispatch("checkLockedState");

      this.commit("account/setAddress", syncWallet.address());
      this.commit("account/setAccountID", accountState.id);

      await this.dispatch("checkout/getAccountUnlockFee");

      await watcher.changeNetworkSet(dispatch, this);

      this.commit("account/setLoggedIn", true);
      return true;
    } catch (error) {
      if (!error.message.includes("User denied")) {
        this.dispatch("toaster/error", error.message);
      }
      return false;
    }
  },
  clearDataStorage({ commit }): void {
    commit("clearDataStorage");
  },
  async forceRefreshData({ dispatch }): Promise<void> {
    await dispatch("getInitialBalances", true).catch((err) => {
      console.log(err);
      // @todo add sentry report
    });
    await dispatch("getzkBalances", { accountState: undefined, force: true }).catch((err) => {
      // @todo add sentry report
      console.log("forceRefreshData | getzkBalances error", err);
    });
  },
  logout({ commit, getters }): void {
    const onboard = getters.getOnboard;
    onboard.walletReset();
    walletData.set({ syncWallet: null, accountState: null });
    localStorage.removeItem("selectedWallet");
    this.commit("account/setLoggedIn", false);
    this.commit("account/setSelectedWallet", "");
    this.commit("account/setAccountID", null);
    commit("setAccountLockedState", false);
    commit("clearDataStorage");
  },
};