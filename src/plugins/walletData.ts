import { Provider, Wallet, AccountState } from "@/plugins/types";

interface iWalletData extends Object {
  [key: string]: object | undefined;
  syncProvider?: Provider;
  syncWallet?: Wallet;
  accountState?: AccountState;
  zkSync?: object;
}

interface iWalletCaller extends Object {
  get(): iWalletData;
  set(val: iWalletData): void;
  zkSync: any;
}

const internalWalletData: iWalletData = {
  syncProvider: undefined,
  syncWallet: undefined,
  accountState: undefined,
  zkSync: undefined,
};

/**
 * Wrapper for the major Providers
 * @type {{accountState: null, syncProvider: null, syncWallet: null, zkSync: any|null}}
 */
export const walletData: iWalletCaller = {
  /**
   * @return {Promise<null|*>}
   */
  zkSync: async (): Promise<any> => {
    if (!process.client) {
      return null;
    }
    if (!internalWalletData.zkSync) {
      [internalWalletData.zkSync] = await Promise.all([import("zksync")]);
    }
    return internalWalletData.zkSync;
  },
  get: (): iWalletData => {
    return internalWalletData;
  },
  set: (val: iWalletData): void => {
    for (const [key, value] of Object.entries(val)) {
      internalWalletData[key] = value;
    }
  },
};
