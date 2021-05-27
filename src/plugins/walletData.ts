import { Provider, Wallet, AccountState } from "@/plugins/types";

interface walletData {
  syncProvider?: Provider;
  syncWallet?: Wallet;
  accountState?: AccountState;
  zkSync?: unknown;
}

const internalWalletData: walletData = {
  syncProvider: undefined,
  syncWallet: undefined,
  accountState: undefined,
  zkSync: undefined,
};

/**
 * Wrapper for the major Providers
 * @type {{accountState: null, syncProvider: null, syncWallet: null, zkSync: any|null}}
 */
export const walletData = {
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
  get: (): walletData => {
    return internalWalletData;
  },
  set: (val: any): void => {
    for (const [key, value] of Object.entries(val)) {
      // @ts-ignore
      internalWalletData[key] = value;
    }
  },
};
